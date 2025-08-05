import { create } from 'zustand'
import { chatApi } from '../services/api'

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  isLoading?: boolean
}

export interface ConversationHistory {
  role: 'user' | 'assistant'
  content: string
}

interface ChatStore {
  messages: ChatMessage[]
  isLoading: boolean
  sessionId: string
  sendMessage: (content: string) => Promise<void>
  addMessage: (content: string, isUser: boolean, isLoading?: boolean) => void
  clearChat: () => void
  hasMessages: boolean
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  sessionId: Date.now().toString() + Math.random().toString(36).substr(2, 9),

  addMessage: (content: string, isUser: boolean, isLoading = false) => {
    const message: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      isUser,
      timestamp: new Date(),
      isLoading
    }
    set((state) => ({
      messages: [...state.messages, message]
    }))
  },

  sendMessage: async (content: string) => {
    if (!content.trim()) return

    const { addMessage, messages, sessionId } = get()
    
    // Build conversation history for context
    const conversationHistory: ConversationHistory[] = messages
      .filter(msg => !msg.isLoading) // Exclude loading messages
      .map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))
    
    // Добавляем сообщение пользователя
    addMessage(content, true)
    
    // Добавляем индикатор загрузки
    const loadingMessageId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    }
    
    set((state) => ({
      messages: [...state.messages, loadingMessage],
      isLoading: true
    }))

    try {
      const response = await chatApi.sendMessage(content, sessionId, conversationHistory)
      
      // Удаляем индикатор загрузки и добавляем ответ
      set((state) => ({
        messages: state.messages.filter(msg => msg.id !== loadingMessageId),
        isLoading: false
      }))
      
      addMessage(response.response, false)
    } catch (error) {
      console.error('Error in chat store:', error)
      
      // Удаляем индикатор загрузки и добавляем сообщение об ошибке
      set((state) => ({
        messages: state.messages.filter(msg => msg.id !== loadingMessageId),
        isLoading: false
      }))
      
      addMessage('Sorry, an error occurred. Please try again!', false)
    }
  },

  clearChat: () => {
    set({ 
      messages: [],
      sessionId: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    })
  },

  get hasMessages() {
    return get().messages.length > 0
  }
})) 