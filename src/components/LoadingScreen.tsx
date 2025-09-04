import React from 'react'
import sentientLogo from '../assets/sentient.png'

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo with animation */}
        <div className="mb-8">
          <img 
            src={sentientLogo} 
            alt="Sentient Logo" 
            className="w-24 h-24 mx-auto animate-pulse"
          />
        </div>
        
        {/* Loading text */}
        <div className="text-white">
          <h1 className="text-2xl font-bold mb-2">Dobby AI</h1>
          <p className="text-gray-300 mb-6">Initializing...</p>
          
          {/* Loading spinner */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
