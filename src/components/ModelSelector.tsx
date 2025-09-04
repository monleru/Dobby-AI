import React, { useState } from 'react'
import { AI_MODELS, AIModelKey } from '../config/constants'

interface ModelSelectorProps {
  selectedModel: AIModelKey
  onModelChange: (model: AIModelKey) => void
  disabled?: boolean
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  onModelChange, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedModelData = AI_MODELS[selectedModel]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">{selectedModelData.name}</span>
          <span className="text-xs text-gray-400 truncate max-w-32">
            {selectedModelData.description.split(' ').slice(0, 4).join(' ')}...
          </span>
        </div>
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
        <div className="absolute top-full right-0 mt-1 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
          <div className="p-2">
            {Object.entries(AI_MODELS).map(([key, model]) => (
              <button
                key={key}
                onClick={() => {
                  onModelChange(key as AIModelKey)
                  setIsOpen(false)
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedModel === key
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-700 text-gray-200'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{model.name}</span>
                    {selectedModel === key && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-400 mt-1">
                    {model.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default ModelSelector
