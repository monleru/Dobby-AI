import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { usePrivy } from '@privy-io/react-auth'
import { useChatStore } from '../stores/chatStore'
import { useLoadingStore } from '../stores/loadingStore'
import { useTheme } from '../contexts/ThemeContext'
import ModelSelector from './ModelSelector'
import ContextNavigator from './ContextNavigator'
import LoadingScreen from './LoadingScreen'
import ShareModal from './ShareModal'
import VoiceInput from './VoiceInput'
import Header from './Header'

const ChatView: React.FC = () => {
  const { authenticated, user, login, getAccessToken, ready } = usePrivy()
  const { messages, isLoading, sendMessage, hasMessages, setUserId, selectedModel, setSelectedModel, loadContextsFromServer, currentContextId, loadCreditStatus, getCreditStatus, getDailyRequests } = useChatStore()
  const { minLoadingComplete, setMinLoadingComplete } = useLoadingStore()
  const { themeColors } = useTheme()
  const [inputMessage, setInputMessage] = useState('')
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Ensure minimum loading time of 3 seconds (only if not already completed)
  useEffect(() => {
    if (!minLoadingComplete) {
      const timer = setTimeout(() => {
        setMinLoadingComplete(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [minLoadingComplete, setMinLoadingComplete])

  const suggestions = [
    '2 + 2 = ?',
    'What is Sentient?',
    'When will Solana kill BTC?',
    'Who is Dobby AI?',
    'Tell me a joke'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return
    
    if (!authenticated) {
      alert('Please login to chat with Dobby!')
      return
    }
    
    const message = inputMessage
    setInputMessage('')
    
    // Get Privy access token for authentication
    const accessToken = await getAccessToken()
    
    await sendMessage(message, user?.id, undefined, accessToken || undefined)
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInputMessage(transcript)
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleShareClick = async () => {
    if (!currentContextId) {
      alert('No context to share. Please start a conversation first.')
      return
    }
    setIsShareModalOpen(true)
  }

  const handleShareSuccess = async (shareUrl: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      // Open shared chat in new window
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      // Still open the window even if clipboard fails
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    console.log('📱 ChatView: Messages changed, count:', messages.length)
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (authenticated && user) {
      const userId = user.id
      setUserId(userId)
      
      // Load contexts and credit status from server when user is authenticated
      const loadData = async () => {
        const accessToken = await getAccessToken()
        if (accessToken) {
          await Promise.all([
            loadContextsFromServer(accessToken),
            loadCreditStatus(accessToken)
          ])
        }
      }
      
      loadData()
    }
  }, [authenticated, user, setUserId, getAccessToken, loadContextsFromServer, loadCreditStatus])

  // Check for shared chat history in URL

  // Show loading screen while Privy is initializing or minimum loading time hasn't passed
  if (!ready || !minLoadingComplete) {
    return <LoadingScreen />
  }


  return (
    <div className={`h-screen ${themeColors.background} flex flex-col relative overflow-hidden transition-colors duration-200`}>
      {/* Animated background gradients - only in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 animate-pulse dark:block hidden"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-800/50 via-transparent to-transparent dark:block hidden"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-bounce-slow dark:block hidden"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow dark:block hidden"></div>
      
      <div className="relative z-10 flex flex-col h-full min-h-0">
        {/* Header */}
        <Header />

        {/* Chat Container or Login Prompt */}
        <div className="max-w-4xl mx-auto px-4 flex-1 py-2 flex flex-col min-h-0">
          {!authenticated ? (
            /* Login Prompt */
            <div className={`${themeColors.backgroundSecondary} rounded-2xl shadow-2xl border ${themeColors.border} overflow-hidden flex-1 flex flex-col min-h-0`}>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-8 max-w-md mx-auto p-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                    <img src="/logo.png" alt="Dobby AI Logo" className="w-full h-full object-cover" />
                  </div>
                  <h2 className={`text-2xl font-bold ${themeColors.text} mb-4`}>
                    Welcome to Dobby AI
                  </h2>
                  <p className={`${themeColors.textSecondary} mb-8 text-lg`}>
                    Please login to start chatting with Dobby AI
                  </p>
                  <div className="space-y-4">
                    <p className={`text-sm ${themeColors.textTertiary}`}>Choose your preferred login method:</p>
                    <div className="flex flex-col space-y-3">
                      <button
                        onClick={login}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
                      >
                        Login
                      </button>
                      <p className={`text-xs ${themeColors.textTertiary}`}>
                        Login with Privy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Chat Interface */
            <div className={`${themeColors.backgroundSecondary} rounded-2xl shadow-2xl border ${themeColors.border} overflow-hidden flex-1 flex flex-col min-h-0`}>
              {/* Model Selector and Chat History Navigator */}
              <div className={`flex items-center justify-between p-3 border-b ${themeColors.border} ${themeColors.backgroundTertiary}`}>
                <div className="flex items-center space-x-3">
                  <ContextNavigator />
                </div>
                <div className="flex items-center space-x-4">
                  {/* Credit Count Display */}
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className={`text-sm font-medium ${themeColors.text}`}>
                      {getCreditStatus()?.remainingCredits ?? getDailyRequests().remainingToday} {getCreditStatus() ? 'Credits' : 'Requests'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${themeColors.textSecondary}`}>AI Model:</span>
                    <ModelSelector 
                      selectedModel={selectedModel}
                      onModelChange={setSelectedModel}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 chat-messages-container relative">
                {/* Share Button - Show when there are messages */}
                {(() => {
                  console.log('🔍 Debug Share Button - hasMessages:', hasMessages, 'messages.length:', messages.length, 'messages:', messages)
                  // Use messages.length directly instead of hasMessages
                  return messages.length > 0
                })() && (
                  <div className="sticky top-0 z-10 flex justify-end mb-4 pb-2 from-gray-800/90 to-transparent">
                    <button
                      onClick={handleShareClick}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                      title="Share this chat conversation with others"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span className="text-sm font-medium">Share Chat</span>
                    </button>
                  </div>
                )}
                
                {/* Welcome Message */}
                {!hasMessages && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      <img src="/logo.png" alt="Dobby AI Logo" className="w-full h-full object-cover" />
                    </div>
                    <h2 className={`text-xl font-semibold ${themeColors.text} mb-2`}>
                      Hello! I'm Dobby AI
                    </h2>
                    <p className={`${themeColors.textSecondary} mb-6 max-w-md mx-auto`}>
                      I'm Dobby AI and you can talk to me!
                    </p>
                    <div className="space-y-2">
                      <p className={`text-sm ${themeColors.textTertiary}`}>Try asking:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={async () => {
                              const accessToken = await getAccessToken()
                              sendMessage(suggestion, user?.id, undefined, accessToken || undefined)
                            }}
                            className={`px-3 py-1 text-sm ${themeColors.buttonSecondary} rounded-full transition-colors`}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`chat-bubble slide-in ${
                      message.isUser ? 'chat-bubble-user' : 'chat-bubble-ai'
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Custom styling for different markdown elements
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className={`border-l-4 ${themeColors.borderSecondary} pl-4 italic mb-2`} {...props} />,
                            code: ({node, ...props}: any) => 
                              props.inline ? 
                                <code className={`${themeColors.backgroundTertiary} px-1 py-0.5 rounded text-sm ${themeColors.text}`} {...props} /> :
                                <code className={`block ${themeColors.backgroundTertiary} p-2 rounded text-sm mb-2 ${themeColors.text}`} {...props} />,
                            pre: ({node, ...props}) => <pre className={`${themeColors.backgroundTertiary} p-2 rounded text-sm mb-2 overflow-x-auto ${themeColors.text}`} {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`border-t ${themeColors.border} p-3 flex-shrink-0 min-h-0`}>
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything"
                    className={`w-full px-4 py-3 pr-12 border ${themeColors.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${themeColors.input}`}
                    disabled={isLoading}
                  />
                  <VoiceInput 
                    onTranscript={handleVoiceTranscript}
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Thinking...
                    </span>
                  ) : (
                    'Send'
                  )}
                </button>
              </form>
            </div>
          </div>
          )}
        </div>
      </div>
      
      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          contextId={currentContextId || ''}
          onShareSuccess={handleShareSuccess}
          accessToken={async () => await getAccessToken()}
          messages={messages}
        />
      )}
    </div>
  )
}

export default ChatView 