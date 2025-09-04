# Chat Context UUID Server Integration

## ✅ Chat Context UUID Sent to Server

The application now sends the chat context UUID (`contextId`) to the server with every API request, enabling the backend to maintain conversation continuity and context awareness.

### 📤 **Enhanced API Request Structure**

Every request to `/chat/send` now includes the chat context UUID:

```json
{
  "message": "User's message text",
  "sessionId": "unique-session-identifier",
  "conversationHistory": [
    {
      "role": "user|assistant",
      "content": "message content",
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "contextId": "ctx_456"
    }
  ],
  "model": "accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new",
  "contextId": "ctx_456"
}
```

### 🔧 **Technical Implementation**

#### API Service Updates (`src/services/api.ts`)

```typescript
async sendMessage(
  message: string, 
  sessionId?: string, 
  conversationHistory?: Array<{role: 'user' | 'assistant'; content: string; uuid: string; contextId?: string}>,
  model?: AIModelKey,
  accessToken?: string,
  contextId?: string  // New parameter for chat context UUID
): Promise<ChatResponse> {
  const requestData = {
    message,
    sessionId,
    conversationHistory,
    model: modelEndpoint,
    contextId,  // Send chat context UUID to server
  }
  
  console.log('🚀 Sending API request with Context ID:', contextId)
  const response = await api.post<ChatResponse>('/chat/send', requestData)
  return response.data
}
```

#### Chat Store Updates (`src/stores/chatStore.ts`)

```typescript
sendMessage: async (content: string, userId?: string, model?: AIModelKey, accessToken?: string, contextId?: string) => {
  const finalHistoryId = contextId || currentContextId
  
  console.log('📤 Sending message with context ID:', finalHistoryId)
  const response = await chatApi.sendMessage(content, sessionId, conversationHistory, finalModel, accessToken, finalHistoryId)
}
```

### 🎯 **Backend Benefits**

#### Context Awareness
- **Conversation Continuity**: Backend knows which chat history the message belongs to
- **Context Isolation**: Different chat histories are kept separate
- **User Experience**: Maintains conversation context across sessions

#### Data Organization
- **Message Grouping**: Messages can be grouped by contextId
- **Analytics**: Track usage patterns per chat history
- **Storage**: Organize message storage by context

#### Advanced Features
- **Context Switching**: Backend can handle context-specific logic
- **Memory Management**: Implement context-specific memory limits
- **Personalization**: Apply context-specific settings or preferences

### 🔍 **Verification**

#### Console Logging
1. **Chat Store**: `📤 Sending message with context ID: [contextId]`
2. **API Service**: `🚀 Sending API request with Context ID: [contextId]`

#### Network Inspection
- Check Network tab in DevTools
- Verify `contextId` field in request payload
- Confirm contextId matches current chat history

### 🚀 **Backend Integration Example**

```javascript
// Backend example
app.post('/chat/send', authenticateToken, (req, res) => {
  const { message, sessionId, conversationHistory, model, contextId } = req.body
  const userId = req.user.id
  
  // Use contextId for conversation continuity
  const chatContext = await getOrCreateChatContext(contextId, userId)
  
  // Process with context awareness
  const aiResponse = await processWithContext(message, model, chatContext, conversationHistory)
  
  // Store response with context
  await storeMessage({
    message: aiResponse,
    contextId,
    userId,
    timestamp: new Date()
  })
  
  res.json({ response: aiResponse, timestamp: new Date() })
})

async function getOrCreateChatContext(contextId, userId) {
  let context = await ChatContext.findById(contextId)
  
  if (!context) {
    context = await ChatContext.create({
      id: contextId,
      userId,
      createdAt: new Date(),
      settings: await getUserPreferences(userId)
    })
  }
  
  return context
}
```

### 📊 **Data Flow**

1. **User sends message** → Frontend
2. **Get current contextId** → Chat Store
3. **Include contextId in request** → API Service
4. **Send to backend** → HTTP Request with contextId
5. **Backend processes** → Uses contextId for conversation continuity
6. **Response returned** → Frontend receives response

### 🎉 **Benefits**

1. **Conversation Continuity**: Backend maintains context across requests
2. **Better Organization**: Messages grouped by chat history
3. **Enhanced UX**: Seamless conversation experience
4. **Scalability**: Support for multiple concurrent conversations
5. **Analytics**: Track usage patterns per chat history
6. **Personalization**: Context-specific settings and preferences

The frontend now provides complete context information to the backend, enabling sophisticated conversation management and enhanced user experience.
