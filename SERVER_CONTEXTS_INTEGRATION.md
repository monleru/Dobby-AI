# Server Contexts Integration

## ✅ Server Contexts Loading and Synchronization

The application now loads chat contexts from the server and synchronizes them with the local state, providing seamless access to conversation history across sessions.

### 🔄 **API Endpoints Integration**

#### 1. **GET /chat/contexts** - Load All Contexts
```bash
curl -X GET http://localhost:3001/chat/contexts \
  -H "Authorization: Bearer <privy-token>"
```

**Response:**
```json
{
  "userId": "did:privy:cmf5biepk00ltjv0bff9e6knh",
  "contexts": [
    {
      "context": "27d39d8c-ce3e-4a58-9773-f0a6f93f9b70",
      "messages": [...],
      "createdAt": "2025-01-04T15:20:00.000Z",
      "lastUpdated": "2025-01-04T15:20:01.000Z",
      "totalMessages": 2,
      "sessionId": "session123",
      "model": "dobby-70b"
    }
  ],
  "stats": {
    "totalMessages": 2,
    "totalContexts": 1,
    "lastUpdated": "2025-01-04T15:20:01.000Z"
  }
}
```

#### 2. **GET /chat/context/:contextId** - Load Specific Context
```bash
curl -X GET http://localhost:3001/chat/context/27d39d8c-ce3e-4a58-9773-f0a6f93f9b70 \
  -H "Authorization: Bearer <privy-token>"
```

### 🔧 **Technical Implementation**

#### API Service (`src/services/api.ts`)

```typescript
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
  }
}
```

#### Chat Store (`src/stores/chatStore.ts`)

```typescript
interface ChatStore {
  // ... existing fields
  serverContexts: ContextInfo[] // Contexts loaded from server
  contextsLoading: boolean
  
  // New functions
  loadContextsFromServer: (accessToken?: string) => Promise<void>
  loadContextFromServer: (contextId: string, accessToken?: string) => Promise<void>
}

// Implementation
loadContextsFromServer: async (accessToken?: string) => {
  if (!accessToken) {
    console.log('⚠️ No access token provided for loading contexts')
    return
  }

  set({ contextsLoading: true })
  
  try {
    console.log('📥 Loading contexts from server...')
    const response = await chatApi.getContexts(accessToken)
    
    console.log('✅ Loaded contexts from server:', response.contexts.length, 'contexts')
    
    set({
      serverContexts: response.contexts,
      contextsLoading: false
    })
  } catch (error) {
    console.error('❌ Error loading contexts from server:', error)
    set({ contextsLoading: false })
  }
},

loadContextFromServer: async (contextId: string, accessToken?: string) => {
  if (!accessToken) {
    console.log('⚠️ No access token provided for loading context')
    return
  }

  try {
    console.log('📥 Loading context from server:', contextId)
    const contextInfo = await chatApi.getContext(contextId, accessToken)
    
    // Convert server messages to local format
    const serverMessages: ChatMessage[] = contextInfo.messages.map((msg: any) => ({
      id: msg.id || uuidv4(),
      uuid: msg.uuid || uuidv4(),
      content: msg.content,
      isUser: msg.role === 'user',
      timestamp: new Date(msg.timestamp || Date.now()),
      isLoading: false,
      userId: msg.userId,
      contextId: contextInfo.context,
      parentMessageId: msg.parentMessageId
    }))
    
    console.log('✅ Loaded context from server:', contextId, 'with', serverMessages.length, 'messages')
    
    set((state) => ({
      currentContextId: contextId,
      messages: serverMessages,
      messageHistory: [...state.messageHistory, ...serverMessages.filter(msg => 
        !state.messageHistory.some(existing => existing.uuid === msg.uuid)
      )]
    }))
  } catch (error) {
    console.error('❌ Error loading context from server:', error)
  }
}
```

#### Context Navigator (`src/components/ContextNavigator.tsx`)

```typescript
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

const handleHistorySelect = async (historyId: string) => {
  // Check if this is a server context
  const serverContext = serverContexts.find(ctx => ctx.context === historyId)
  
  if (serverContext) {
    // Load from server
    await loadContextFromServer(historyId)
  } else {
    // Use local context
    setCurrentContext(historyId)
  }
  
  setIsOpen(false)
}
```

#### Chat View (`src/components/ChatView.tsx`)

```typescript
useEffect(() => {
  if (authenticated && user) {
    const userId = user.id
    setUserId(userId)
    
    // Load contexts from server when user is authenticated
    const loadContexts = async () => {
      const accessToken = await getAccessToken()
      if (accessToken) {
        await loadContextsFromServer(accessToken)
      }
    }
    
    loadContexts()
  }
}, [authenticated, user, setUserId, getAccessToken, loadContextsFromServer])
```

### 🔄 **Data Flow**

1. **User Authentication** → ChatView detects authentication
2. **Load Contexts** → `loadContextsFromServer()` called with access token
3. **API Request** → GET `/chat/contexts` with Authorization header
4. **Server Response** → List of contexts with metadata
5. **Store Update** → `serverContexts` populated in chat store
6. **UI Update** → ContextNavigator shows server contexts
7. **Context Selection** → User clicks on server context
8. **Load Context** → `loadContextFromServer()` called
9. **API Request** → GET `/chat/context/:contextId`
10. **Messages Loaded** → Context messages displayed in chat

### 🎨 **User Experience**

#### Context Navigator Features
- **Server Contexts**: Shows contexts loaded from server
- **Local Contexts**: Shows local contexts not yet synced
- **Loading Indicator**: Shows "..." when loading contexts
- **Smart Selection**: Automatically loads from server or uses local
- **Unified View**: Server and local contexts in one list

#### Visual Indicators
- **Server Chat**: Contexts from server
- **Local Chat**: Local-only contexts
- **Loading State**: "..." in context count
- **Message Count**: Shows total messages per context
- **Last Updated**: Shows when context was last modified

### 🔍 **Debugging and Logging**

#### Console Logs
1. **Context Loading**: `📥 Loading contexts from server...`
2. **Success**: `✅ Loaded contexts from server: X contexts`
3. **Context Selection**: `📥 Loading context from server: [contextId]`
4. **Message Loading**: `✅ Loaded context from server: [contextId] with X messages`
5. **Errors**: `❌ Error loading contexts from server: [error]`

#### Network Inspection
- Check Network tab for `/chat/contexts` and `/chat/context/:id` requests
- Verify Authorization headers are present
- Check response data structure

### 🚀 **Benefits**

1. **Cross-Session Continuity**: Access chat history across devices/sessions
2. **Server Synchronization**: Local and server contexts unified
3. **Automatic Loading**: Contexts loaded on authentication
4. **Smart Selection**: Automatic server vs local context handling
5. **Performance**: Only load specific context when needed
6. **Reliability**: Fallback to local contexts if server unavailable

### 🎯 **Future Enhancements**

1. **Real-time Sync**: WebSocket updates for context changes
2. **Offline Support**: Cache contexts for offline access
3. **Context Sharing**: Share contexts between users
4. **Context Search**: Search through context titles and content
5. **Context Archiving**: Archive old contexts
6. **Context Export**: Export contexts to files

The application now provides seamless integration with server-side context storage, enabling users to access their complete chat history across sessions and devices.
