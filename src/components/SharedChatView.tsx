import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { chatApi, SharedContextData } from '../services/api'
import LoadingScreen from './LoadingScreen'
import Header from './Header'

interface SharedChatViewProps {
  shareId: string
}

const SharedChatView: React.FC<SharedChatViewProps> = ({ shareId }) => {
  const [sharedData, setSharedData] = useState<SharedContextData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSharedContext = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await chatApi.getPublicSharedContext(shareId)
        
        // Check if response has success property (wrapped response)
        if (response.success && response.sharedContext) {
          setSharedData(response.sharedContext)
        } 
        // Check if response is the data directly (unwrapped response)
        else if (response.shareId && response.messages) {
          setSharedData(response as SharedContextData)
        } else {
          setError('Shared context not found')
        }
      } catch (err) {
        console.error('Error loading shared context:', err)
        setError('Failed to load shared context')
      } finally {
        setLoading(false)
      }
    }

    if (shareId) {
      loadSharedContext()
    }
  }, [shareId])

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!sharedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Not Found</h1>
          <p className="text-gray-300 mb-6">This shared conversation could not be found.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Header */}
      <Header 
        title="Dobby AI"
        subtitle="Shared Conversation"
        customRightContent={
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Try Dobby AI
          </button>
        }
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Conversation Header */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-600 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{sharedData.title}</h2>
          <p className="text-gray-300 mb-4">{sharedData.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{sharedData.totalMessages} messages</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Created {new Date(sharedData.createdAt).toLocaleDateString()}</span>
            </div>
            
            {sharedData.model && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Model: {sharedData.model}</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-gray-700 rounded-2xl shadow-2xl border border-gray-600 overflow-hidden">
          <div className="p-6 space-y-6">
            {sharedData.messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-100'
                  }`}
                >
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="text-sm leading-relaxed"
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 mb-4">
            This conversation was shared from Dobby AI
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Your Own Conversation
          </button>
        </div>
      </div>
    </div>
  )
}

export default SharedChatView
