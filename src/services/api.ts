import axios from 'axios'

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

export const chatApi = {
  async sendMessage(
    message: string, 
    sessionId?: string, 
    conversationHistory?: Array<{role: 'user' | 'assistant'; content: string}>
  ): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>('/chat/send', {
      message,
      sessionId,
      conversationHistory,
    })
    return response.data
  },
}

export default api 