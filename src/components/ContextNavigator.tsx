import React, { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useChatStore } from '../stores/chatStore'
import SharedContextManager from './SharedContextManager'

interface ChatHistoryInfo {
  historyId: string
  title: string
  messageCount: number
  lastMessage: Date
}

const ContextNavigator: React.FC = () => {
  const { getAccessToken } = usePrivy()
  const { 
    messageHistory, 
    currentContextId, 
    setCurrentContext, 
    createNewContext,
    getMessagesByContext,
    serverContexts,
    contextsLoading,
    loadContextFromServer
  } = useChatStore()
  
  const [isOpen, setIsOpen] = useState(false)
  const [showSharedManager, setShowSharedManager] = useState(false)

  // Get unique chat histories from server contexts and local message history
  const getChatHistories = (): ChatHistoryInfo[] => {
    const historyMap = new Map<string, ChatHistoryInfo>()
    
    // First, add server contexts
    serverContexts.forEach(serverContext => {
      const firstUserMessage = serverContext.messages.find((msg: any) => msg.role === 'user')
      
      historyMap.set(serverContext.context, {
        historyId: serverContext.context,
        title: firstUserMessage?.content?.slice(0, 50) + '...' || 'Server Chat',
        messageCount: serverContext.totalMessages,
        lastMessage: new Date(serverContext.lastUpdated)
      })
    })
    
    // Then, add local contexts that aren't on server
    messageHistory.forEach(msg => {
      if (!msg.contextId) return
      
      if (!historyMap.has(msg.contextId)) {
        const historyMessages = getMessagesByContext(msg.contextId)
        const firstUserMessage = historyMessages.find(m => m.isUser)
        
        historyMap.set(msg.contextId, {
          historyId: msg.contextId,
          title: firstUserMessage?.content.slice(0, 50) + '...' || 'Local Chat',
          messageCount: historyMessages.length,
          lastMessage: msg.timestamp
        })
      }
    })
    
    return Array.from(historyMap.values()).sort((a, b) => 
      b.lastMessage.getTime() - a.lastMessage.getTime()
    )
  }

  const chatHistories = getChatHistories()

  const handleHistorySelect = async (historyId: string) => {
    // Check if this is a server context
    const serverContext = serverContexts.find(ctx => ctx.context === historyId)
    
    if (serverContext) {
      // Load from server with access token
      const accessToken = await getAccessToken()
      if (accessToken) {
        await loadContextFromServer(historyId, accessToken)
      } else {
        console.error('❌ No access token available for loading context')
      }
    } else {
      // Use local context
      setCurrentContext(historyId)
    }
    
    setIsOpen(false)
  }

  const handleNewChat = () => {
    createNewContext()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span className="text-sm">Chat History</span>
        <span className="text-xs bg-gray-600 px-2 py-1 rounded-full">
          {contextsLoading ? '...' : chatHistories.length}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
          <div className="p-2">
            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-colors mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">New Chat</span>
            </button>

            {/* Shared Contexts Button */}
            <button
              onClick={() => setShowSharedManager(true)}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-colors mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="text-sm font-medium">Shared Chats</span>
            </button>

            {/* Chat History List */}
            {chatHistories.length > 0 && (
              <div className="border-t border-gray-600 pt-2">
                <p className="text-xs text-gray-400 px-2 py-1 mb-2">Recent Chats</p>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {chatHistories.map((chatHistory) => (
                    <button
                      key={chatHistory.historyId}
                      onClick={() => handleHistorySelect(chatHistory.historyId)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        chatHistory.historyId === currentContextId
                          ? 'bg-purple-600 text-white'
                          : 'hover:bg-gray-700 text-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {chatHistory.title}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{chatHistory.messageCount} messages</span>
                            <span>•</span>
                            <span>
                              {chatHistory.lastMessage.toLocaleDateString()} {chatHistory.lastMessage.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        {chatHistory.historyId === currentContextId && (
                          <div className="w-2 h-2 bg-white rounded-full ml-2"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatHistories.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">No chat history yet</p>
                <p className="text-xs text-gray-500 mt-1">Start a new chat to see it here</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shared Context Manager Modal */}
      {showSharedManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Shared Contexts</h2>
              <button
                onClick={() => setShowSharedManager(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SharedContextManager />
          </div>
        </div>
      )}
    </div>
  )
}

export default ContextNavigator
