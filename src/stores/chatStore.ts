import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { chatApi, ContextInfo } from '../services/api'
import { AIModelKey, AI_MODELS, LOCALSTORAGE_KEYS } from '../config/constants'

// Helper functions for localStorage
const saveSelectedModelToStorage = (model: AIModelKey) => {
  try {
    localStorage.setItem(LOCALSTORAGE_KEYS.SELECTED_MODEL, model)
    console.log('💾 Saved selected model to localStorage:', model)
  } catch (error) {
    console.error('❌ Error saving model to localStorage:', error)
  }
}

const loadSelectedModelFromStorage = (): AIModelKey | null => {
  try {
    const savedModel = localStorage.getItem(LOCALSTORAGE_KEYS.SELECTED_MODEL) as AIModelKey
    if (savedModel && savedModel in AI_MODELS) {
      console.log('📂 Loaded selected model from localStorage:', savedModel)
      return savedModel
    }
  } catch (error) {
    console.error('❌ Error loading model from localStorage:', error)
  }
  return null
}

export interface ChatMessage {
  id: string
  uuid: string // Unique UUID for each message
  content: string
  isUser: boolean
  timestamp: Date
  isLoading?: boolean
  userId?: string
  contextId?: string // UUID of the chat history
  parentMessageId?: string // UUID of the parent message for threading
}

export interface ConversationHistory {
  role: 'user' | 'assistant'
  content: string
  uuid: string // UUID of the message
  contextId?: string // Chat history UUID
}

interface ChatStore {
  messages: ChatMessage[]
  isLoading: boolean
  sessionId: string
  userId?: string
  selectedModel: AIModelKey
  currentContextId?: string // Current chat history
  messageHistory: ChatMessage[] // Full message history for chat history navigation
  serverContexts: ContextInfo[] // Contexts loaded from server
  contextsLoading: boolean
  sendMessage: (content: string, userId?: string, model?: AIModelKey, accessToken?: string, contextId?: string) => Promise<void>
  addMessage: (content: string, isUser: boolean, isLoading?: boolean, userId?: string, contextId?: string, parentMessageId?: string) => void
  clearChat: () => void
  hasMessages: boolean
  setUserId: (userId: string) => void
  setSelectedModel: (model: AIModelKey) => void
  setCurrentContext: (contextId: string) => void
  getMessagesByContext: (contextId: string) => ChatMessage[]
  createNewContext: () => string
  loadContextsFromServer: (accessToken?: string) => Promise<void>
  loadContextFromServer: (contextId: string, accessToken?: string) => Promise<void>
  shareChatHistory: () => Promise<void>
  loadSharedChatHistory: (sharedData: any) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  sessionId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  userId: undefined,
  selectedModel: loadSelectedModelFromStorage() || 'dobby-70b',
  currentContextId: undefined,
  messageHistory: [],
  serverContexts: [],
  contextsLoading: false,

  setUserId: (userId: string) => {
    set({ userId })
  },

  setSelectedModel: (model: AIModelKey) => {
    set({ selectedModel: model })
    saveSelectedModelToStorage(model)
  },

  addMessage: (content: string, isUser: boolean, isLoading = false, userId?: string, contextId?: string, parentMessageId?: string) => {
    const { currentContextId } = get()
    const messageUuid = uuidv4()
    const messageHistoryId = contextId || currentContextId || uuidv4()
    
    const message: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      uuid: messageUuid,
      content,
      isUser,
      timestamp: new Date(),
      isLoading,
      userId: userId || get().userId,
      contextId: messageHistoryId,
      parentMessageId
    }
    
    set((state) => ({
      messages: [...state.messages, message],
      messageHistory: [...state.messageHistory, message],
      currentContextId: messageHistoryId // Always set current context
    }))
  },

  sendMessage: async (content: string, userId?: string, model?: AIModelKey, accessToken?: string, contextId?: string) => {
    if (!content.trim()) return

    const { addMessage, messages, sessionId, userId: currentUserId, selectedModel, currentContextId } = get()
    const finalUserId = userId || currentUserId
    const finalModel = model || selectedModel
    const finalHistoryId = contextId || currentContextId || uuidv4() // Create new context if none exists
    
    // Build conversation history for chat history
    const conversationHistory: ConversationHistory[] = messages
      .filter(msg => !msg.isLoading && msg.contextId === finalHistoryId) // Only current chat history messages
      .map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content,
        uuid: msg.uuid,
        contextId: msg.contextId
      }))
    
    console.log('🔍 Debug - Current contextId:', currentContextId, 'Final historyId:', finalHistoryId, 'Messages count:', messages.length, 'Conversation history length:', conversationHistory.length)
    
    // Добавляем сообщение пользователя
    addMessage(content, true, false, finalUserId, finalHistoryId)
    
    // Добавляем индикатор загрузки
    const loadingMessageId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      uuid: uuidv4(),
      content: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
      userId: finalUserId,
      contextId: finalHistoryId
    }
    
    set((state) => ({
      messages: [...state.messages, loadingMessage],
      messageHistory: [...state.messageHistory, loadingMessage],
      isLoading: true
    }))

    try {
      const modelEndpoint = finalModel ? AI_MODELS[finalModel].endpoint : 'default'
      console.log('📤 Sending message with model:', finalModel, 'endpoint:', modelEndpoint, 'for user:', finalUserId, 'with auth token:', accessToken ? 'Present' : 'Missing', 'context ID:', finalHistoryId)
      const response = await chatApi.sendMessage(content, sessionId, conversationHistory, finalModel, accessToken, finalHistoryId)
      
      // Удаляем индикатор загрузки и добавляем ответ
      set((state) => ({
        messages: state.messages.filter(msg => msg.id !== loadingMessageId),
        messageHistory: state.messageHistory.filter(msg => msg.id !== loadingMessageId),
        isLoading: false
      }))
      
      addMessage(response.response, false, false, finalUserId, finalHistoryId)
    } catch (error) {
      console.error('Error in chat store:', error)
      
      // Удаляем индикатор загрузки и добавляем сообщение об ошибке
      set((state) => ({
        messages: state.messages.filter(msg => msg.id !== loadingMessageId),
        messageHistory: state.messageHistory.filter(msg => msg.id !== loadingMessageId),
        isLoading: false
      }))
      
      addMessage('Sorry, an error occurred. Please try again!', false, false, finalUserId, finalHistoryId)
    }
  },

  clearChat: () => {
    set({ 
      messages: [],
      messageHistory: [],
      currentContextId: undefined,
      sessionId: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    })
  },

  setCurrentContext: (contextId: string) => {
    const { messageHistory } = get()
    const contextMessages = messageHistory.filter(msg => msg.contextId === contextId)
    
    console.log('🔄 Setting current context:', contextId, 'Found', contextMessages.length, 'messages in messageHistory')
    
    set({
      currentContextId: contextId,
      messages: contextMessages
    })
  },

  getMessagesByContext: (contextId: string) => {
    const { messageHistory } = get()
    return messageHistory.filter(msg => msg.contextId === contextId)
  },

  createNewContext: () => {
    const newContextId = uuidv4()
    set({
      currentContextId: newContextId,
      messages: []
    })
    return newContextId
  },

  loadContextsFromServer: async (accessToken?: string) => {
    if (!accessToken) {
      console.log('⚠️ No access token provided for loading contexts')
      return
    }

    set({ contextsLoading: true })
    
    try {
      console.log('📥 Loading contexts from server...')
      const response = await chatApi.getContexts(accessToken)
      
      console.log('✅ Loaded contexts from server:', response.contexts.length, 'contexts')
      
      set({
        serverContexts: response.contexts,
        contextsLoading: false
      })
    } catch (error) {
      console.error('❌ Error loading contexts from server:', error)
      set({ contextsLoading: false })
    }
  },

  loadContextFromServer: async (contextId: string, accessToken?: string) => {
    if (!accessToken) {
      console.log('⚠️ No access token provided for loading context')
      return
    }

    try {
      console.log('📥 Loading context from server:', contextId)
      const contextInfo = await chatApi.getContext(contextId, accessToken)
      
      // Convert server messages to local format
      const serverMessages: ChatMessage[] = contextInfo.messages.map((msg: any) => ({
        id: msg.id || uuidv4(),
        uuid: msg.uuid || uuidv4(),
        content: msg.content,
        isUser: msg.role === 'user',
        timestamp: new Date(msg.timestamp || Date.now()),
        isLoading: false,
        userId: msg.userId,
        contextId: contextInfo.context,
        parentMessageId: msg.parentMessageId
      }))
      
      console.log('✅ Loaded context from server:', contextId, 'with', serverMessages.length, 'messages')
      
      set((state) => ({
        currentContextId: contextId,
        messages: serverMessages,
        messageHistory: [...state.messageHistory, ...serverMessages.filter(msg => 
          !state.messageHistory.some(existing => existing.uuid === msg.uuid)
        )]
      }))
      
      console.log('✅ Context loaded and set. Current messages count:', serverMessages.length)
    } catch (error) {
      console.error('❌ Error loading context from server:', error)
    }
  },

  shareChatHistory: async () => {
    const { messages, currentContextId, selectedModel } = get()
    
    if (messages.length === 0) {
      console.log('⚠️ No messages to share')
      return
    }

    try {
      // Create shareable data
      const shareData = {
        contextId: currentContextId,
        model: selectedModel,
        messages: messages.map(msg => ({
          content: msg.content,
          isUser: msg.isUser,
          timestamp: msg.timestamp.toISOString()
        })),
        sharedAt: new Date().toISOString()
      }

      // Generate shareable URL (you can customize this based on your needs)
      const shareUrl = `${window.location.origin}?shared=${encodeURIComponent(JSON.stringify(shareData))}`
      
      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'Dobby AI Chat History',
          text: `Check out this chat with Dobby AI (${selectedModel})`,
          url: shareUrl
        })
        console.log('✅ Chat history shared via Web Share API')
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl)
        console.log('✅ Chat history URL copied to clipboard')
        
        // Show a temporary notification (you might want to add a toast notification)
        alert('Chat history URL copied to clipboard!')
      }
    } catch (error) {
      console.error('❌ Error sharing chat history:', error)
      
      // Fallback: copy messages as text
      try {
        const textContent = messages.map(msg => 
          `${msg.isUser ? 'You' : 'Dobby AI'}: ${msg.content}`
        ).join('\n\n')
        
        await navigator.clipboard.writeText(textContent)
        console.log('✅ Chat history copied as text to clipboard')
        alert('Chat history copied as text to clipboard!')
      } catch (clipboardError) {
        console.error('❌ Error copying to clipboard:', clipboardError)
        alert('Unable to share chat history. Please try again.')
      }
    }
  },

  loadSharedChatHistory: (sharedData: any) => {
    try {
      console.log('📥 Loading shared chat history:', sharedData)
      
      // Convert shared messages to local format
      const sharedMessages: ChatMessage[] = sharedData.messages.map((msg: any, index: number) => ({
        id: `shared_${index}_${Date.now()}`,
        uuid: uuidv4(),
        content: msg.content,
        isUser: msg.isUser,
        timestamp: new Date(msg.timestamp),
        isLoading: false,
        userId: undefined, // Shared messages don't have user ID
        contextId: sharedData.contextId || 'shared',
        parentMessageId: undefined
      }))
      
      // Set the model if provided
      if (sharedData.model) {
        set({ selectedModel: sharedData.model })
      }
      
      // Set the messages
      set({
        currentContextId: sharedData.contextId || 'shared',
        messages: sharedMessages,
        messageHistory: [...get().messageHistory, ...sharedMessages]
      })
      
      console.log('✅ Shared chat history loaded:', sharedMessages.length, 'messages')
    } catch (error) {
      console.error('❌ Error loading shared chat history:', error)
    }
  },

  get hasMessages() {
    return get().messages.length > 0
  }
})) 