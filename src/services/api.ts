import axios from 'axios'
import { AIModelKey, AI_MODELS } from '../config/constants'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://api.uselessai.fun/'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ChatResponse {
  response: string
  timestamp: Date
}

export interface ContextInfo {
  context: string
  messages: any[]
  createdAt: string
  lastUpdated: string
  totalMessages: number
  sessionId: string
  model: string
}

export interface ContextsResponse {
  userId: string
  contexts: ContextInfo[]
  stats: {
    totalMessages: number
    totalContexts: number
    lastUpdated: string
  }
}

export const chatApi = {
  async sendMessage(
    message: string, 
    sessionId?: string, 
    conversationHistory?: Array<{role: 'user' | 'assistant'; content: string; uuid: string; contextId?: string}>,
    model?: AIModelKey,
    accessToken?: string,
    contextId?: string
  ): Promise<ChatResponse> {
    // Get the endpoint for the selected model
    const modelEndpoint = model ? AI_MODELS[model].endpoint : undefined
    
    const requestData = {
      message,
      sessionId,
      conversationHistory,
      model: modelEndpoint, // Send endpoint instead of model key
      contextId, // Send chat context UUID
    }
    
    // Prepare headers with authentication
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    // Add Privy access token if available
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    
    // Log the request to verify model endpoint, auth, and context are being sent
    console.log('🚀 Sending API request with model endpoint:', modelEndpoint, 'Auth token:', accessToken ? 'Present' : 'Missing', 'Context ID:', contextId)
    console.log('📋 Full request data:', JSON.stringify(requestData, null, 2))
    
    const response = await api.post<ChatResponse>('/chat/send', requestData, { headers })
    return response.data
  },

  async getContexts(accessToken?: string): Promise<ContextsResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    
    console.log('📥 Fetching contexts from server with auth token:', accessToken ? 'Present' : 'Missing')
    
    const response = await api.get<ContextsResponse>('/chat/contexts', { headers })
    return response.data
  },

  async getContext(contextId: string, accessToken?: string): Promise<ContextInfo> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    
    console.log('📥 Fetching context:', contextId, 'with auth token:', accessToken ? 'Present' : 'Missing')
    
    const response = await api.get<ContextInfo>(`/chat/context/${contextId}`, { headers })
    return response.data
  },
}

export default api 