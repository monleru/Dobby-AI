import axios from 'axios'
import { AIModelKey, AI_MODELS } from '../config/constants'


console.log('env',(import.meta as any).env.DEV)
const API_BASE_URL = (import.meta as any).env?.DEV ? 'http://localhost:3001' : 'https://api.uselessai.fun/'

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

export interface SharedContextInfo {
  shareId: string
  title: string
  description: string
  totalMessages: number
  createdAt: string
  lastUpdated: string
  model: string
}

export interface SharedContextsResponse {
  success: boolean
  sharedContexts: SharedContextInfo[]
}

export interface ShareContextRequest {
  contextId: string
  title: string
  description: string
  isPublic: boolean
}

export interface ShareContextResponse {
  success: boolean
  shareId: string
  shareUrl: string
  message: string
}

export interface SharedContextData {
  shareId: string
  title: string
  description: string
  originalUserId: string
  originalContextId: string
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    sessionId: string
    contextId: string
    model: string
  }>
  totalMessages: number
  createdAt: string
  lastUpdated: string
  model: string
}

export interface SharedContextResponse {
  success?: boolean
  sharedContext?: SharedContextData
  // Direct response format (when server returns data directly)
  shareId?: string
  title?: string
  description?: string
  messages?: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    sessionId: string
    contextId: string
    model: string
  }>
  totalMessages?: number
  createdAt?: string
  lastUpdated?: string
  model?: string
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

  // Shared Context methods
  async shareContext(
    contextId: string, 
    title: string, 
    description: string, 
    accessToken: string
  ): Promise<ShareContextResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
    
    const requestData: ShareContextRequest = {
      contextId,
      title,
      description,
      isPublic: true
    }
    
    console.log('🔗 Sharing context:', contextId, 'with title:', title)
    
    const response = await api.post<ShareContextResponse>('/chat/shared', requestData, { headers })
    return response.data
  },

  async getSharedContexts(accessToken: string): Promise<SharedContextsResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
    
    console.log('📥 Fetching shared contexts')
    
    const response = await api.get<SharedContextsResponse>('/chat/shared', { headers })
    return response.data
  },

  async deleteSharedContext(shareId: string, accessToken: string): Promise<{ success: boolean; message: string }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
    
    console.log('🗑️ Deleting shared context:', shareId)
    
    const response = await api.post<{ success: boolean; message: string }>(`/chat/shared/${shareId}/delete`, {}, { headers })
    return response.data
  },

  async getPublicSharedContext(shareId: string): Promise<SharedContextResponse> {
    console.log('📖 Fetching public shared context:', shareId)
    
    const response = await api.get<SharedContextResponse>(`/shared/${shareId}`)
    return response.data
  },
}

export default api 