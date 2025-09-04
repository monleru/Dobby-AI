import React from 'react'
import { usePrivy } from '@privy-io/react-auth'

const LoginButton: React.FC = () => {
  const { ready, authenticated, user, login, logout } = usePrivy()

  if (!ready) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    )
  }

  if (authenticated && user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user.email?.address?.charAt(0).toUpperCase() || user.wallet?.address?.slice(0, 2).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-white font-medium">
              {user.email?.address || `${user.wallet?.address?.slice(0, 6)}...${user.wallet?.address?.slice(-4)}`}
            </p>
            <p className="text-xs text-gray-400">Connected</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-xs bg-red-600 hover:bg-red-700 hover:scale-105 transition text-white px-3 py-2 rounded transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={login}
      data-testid="login-button"
      className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:scale-105 transition text-white px-4 py-2 rounded transition-colors font-medium flex items-center space-x-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      <span>Login</span>
    </button>
  )
}

export default LoginButton
