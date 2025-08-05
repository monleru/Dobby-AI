import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChatStore } from '../stores/chatStore'
import FloatingSlang from './FloatingSlang'
import { CONTRACT_ADDRESS, NETWORK, DEX_SCREENER_URL, TICKER, X_URL } from '../config/constants'

const ChatView: React.FC = () => {
  const { messages, isLoading, sendMessage, clearChat, hasMessages } = useChatStore()
  const [inputMessage, setInputMessage] = useState('')
  const [showCopied, setShowCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

    const suggestions = [
    '2 + 2 = ?',
    'What is my name?',
    'When will Solana kill BTC?',
    'Why is Bonk better than PumpFun?',
    'What is your CA?',
    'Tell me a joke'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return
    
    const message = inputMessage
    setInputMessage('')
    
    await sendMessage(message)
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex flex-col relative overflow-hidden">
      {/* Floating slang words */}
      <FloatingSlang />
      
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-bounce-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="relative z-10 flex flex-col h-full min-h-0">
        {/* Header */}
        <header className="bg-gray-800 shadow-lg border-b border-gray-700 flex-shrink-0">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <img src="/logo.webp" alt="Useless AI Logo" className="w-full h-full object-cover" />
              </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Useless AI</h1>
                  <p className="text-sm text-gray-400">Just a useless AI</p>
                </div>
              </div>
              
              {/* Ticker and Contract Address */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono text-green-400">$AILESS</span>
                  {/* <span className="text-sm text-gray-400">$0.000420</span> */}
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-xs text-gray-500">CA:</span>
                  <span className="text-xs font-mono text-blue-400">{CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(CONTRACT_ADDRESS);
                      setShowCopied(true);
                      setTimeout(() => setShowCopied(false), 2000);
                    }}
                    className="text-xs text-gray-500 hover:text-blue-400 transition-colors p-1 rounded hover:bg-gray-700 relative"
                    title="Copy Contract Address"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {showCopied && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20">
                        Copied!
                      </div>
                    )}
                  </button>
                  <button 
                    onClick={() => window.open(`${DEX_SCREENER_URL}/${CONTRACT_ADDRESS}`, '_blank')}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors font-medium buy-button-pulse"
                    title={`Buy on ${NETWORK} DexScreener`}
                  >
                    Buy
                  </button>
                  <button 
                    onClick={() => window.open(X_URL, '_blank')}
                    className="text-xs bg-black hover:bg-gray-800 text-white px-2 py-1 rounded transition-colors font-medium"
                    title="Follow us on X"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto px-4 flex-1 py-2 flex flex-col min-h-0">
          <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-600 overflow-hidden flex-1 flex flex-col glow-animation min-h-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 chat-messages-container">
              {/* Welcome Message */}
              {!hasMessages && (
                <div className="text-center py-8">
                                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <img src="/logo.webp" alt="Useless AI Logo" className="w-full h-full object-cover" />
                </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Hello! I'm most Useless AI
                  </h2>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    I'm absolutely useless AI but you can talk to me!
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Try asking:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => sendMessage(suggestion)}
                          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-full transition-colors"
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
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2" {...props} />,
                            code: ({node, ...props}: any) => 
                              props.inline ? 
                                <code className="bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-200" {...props} /> :
                                <code className="block bg-gray-700 p-2 rounded text-sm mb-2 text-gray-200" {...props} />,
                            pre: ({node, ...props}) => <pre className="bg-gray-700 p-2 rounded text-sm mb-2 overflow-x-auto text-gray-200" {...props} />,
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
            <div className="border-t border-gray-700 p-3 flex-shrink-0 min-h-0">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="2 + 2 = 5"
                  className="flex-1 px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                  disabled={isLoading}
                />
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
        </div>
      </div>
    </div>
  )
}

export default ChatView 