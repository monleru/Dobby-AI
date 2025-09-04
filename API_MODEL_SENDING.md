# API Model Sending Implementation

## ✅ Model is Sent in Every API Request

The application is correctly configured to send the selected AI model with every API request to the backend.

### 🔄 **Request Flow**

1. **User sends message** → ChatView component
2. **Message processed** → ChatStore sendMessage function
3. **Model selected** → Uses selectedModel from store (default: 'dobby-70b')
4. **API call made** → chatApi.sendMessage with model parameter
5. **Backend receives** → Complete request with model information

### 📤 **API Request Structure**

Every request to `/chat/send` includes:

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
  "model": "accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new" | "accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b",
  "contextId": "ctx_456"
}
```

**Note**: The `model` field now contains the full endpoint path, not the model key name. The `contextId` field contains the UUID of the current chat history.

### 🔧 **Technical Implementation**

#### 1. **Chat Store** (`src/stores/chatStore.ts`)
```typescript
sendMessage: async (content: string, userId?: string, model?: AIModelKey) => {
  const { selectedModel } = get()
  const finalModel = model || selectedModel  // Uses selected model
  
  // Logs the model and context being sent
  console.log('📤 Sending message with model:', finalModel, 'context ID:', finalHistoryId)
  
  // Sends model and context to API
  const response = await chatApi.sendMessage(content, sessionId, conversationHistory, finalModel, accessToken, finalHistoryId)
}
```

#### 2. **API Service** (`src/services/api.ts`)
```typescript
async sendMessage(
  message: string, 
  sessionId?: string, 
  conversationHistory?: Array<{role: 'user' | 'assistant'; content: string; uuid: string; contextId?: string}>,
  model?: AIModelKey,  // Model key parameter
  accessToken?: string,
  contextId?: string  // Chat history context ID
): Promise<ChatResponse> {
  // Get the endpoint for the selected model
  const modelEndpoint = model ? AI_MODELS[model].endpoint : undefined
  
  const requestData = {
    message,
    sessionId,
    conversationHistory,
    model: modelEndpoint,  // Send endpoint instead of model key
    contextId,  // Send chat history context ID
  }
  
  // Logs the complete request with endpoint and context
  console.log('🚀 Sending API request with model endpoint:', modelEndpoint, 'Context ID:', contextId)
  
  const response = await api.post<ChatResponse>('/chat/send', requestData)
  return response.data
}
```

### 🎯 **Model Selection Logic**

#### Default Model
- **Default**: `dobby-70b` (highest quality model)
- **Set in**: ChatStore initialization
- **Used when**: No specific model is provided

#### Model Selection
- **User selects**: Model via ModelSelector component
- **Stored in**: ChatStore selectedModel state
- **Applied to**: All subsequent messages until changed

#### Override Capability
- **Function signature**: `sendMessage(content, userId?, model?)`
- **Override**: Can pass specific model for individual messages
- **Fallback**: Uses selectedModel if no override provided

### 📊 **Logging and Debugging**

#### Console Logs Added
1. **Chat Store**: `📤 Sending message with model: [model] endpoint: [endpoint] for user: [userId] with auth token: [Present/Missing] context ID: [contextId]`
2. **API Service**: `🚀 Sending API request with model endpoint: [endpoint] Auth token: [Present/Missing] Context ID: [contextId] Request data: [fullRequest]`

#### Debug Information
- **Model being sent**: Clearly logged in console
- **User ID**: Tracked for each request
- **Full request data**: Complete request object logged
- **Request timing**: Logs before API call

### 🔍 **Verification Steps**

To verify model is being sent:

1. **Open browser console** (F12)
2. **Send a message** in the chat
3. **Check console logs** for:
   - `📤 Sending message with model: [model] endpoint: [endpoint] context ID: [contextId]`
   - `🚀 Sending API request with model endpoint: [endpoint] Context ID: [contextId]`
4. **Verify endpoint and context values** match the selected model and current chat history

### 🎨 **User Experience**

#### Model Selection
- **Visible**: Model selector in chat block
- **Immediate**: Changes apply to next message
- **Persistent**: Selection maintained across session
- **Clear**: Model name and description shown

#### Request Transparency
- **Logged**: All requests logged to console
- **Trackable**: Model selection clearly visible
- **Debuggable**: Easy to verify correct model is sent

### 🚀 **Backend Integration**

The backend should expect and handle the `model` parameter:

```javascript
// Backend example
app.post('/chat/send', (req, res) => {
  const { message, sessionId, conversationHistory, model } = req.body
  
  // Use the model parameter to route to appropriate AI model
  const aiResponse = await processWithModel(message, model)
  
  res.json({ response: aiResponse, timestamp: new Date() })
})
```

The frontend is fully configured to send the model endpoint and chat context UUID with every request, ensuring the backend receives the correct endpoint information and context for processing each message with the appropriate AI model and maintaining conversation continuity.
