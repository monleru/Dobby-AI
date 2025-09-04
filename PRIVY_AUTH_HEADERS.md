# Privy Authentication Headers Implementation

## ✅ Privy Access Token Sent in API Headers

The application now sends Privy authentication tokens in the `Authorization` header with every API request to the backend.

### 🔐 **Authentication Flow**

1. **User logs in** → Privy authentication
2. **User sends message** → ChatView component
3. **Get access token** → `getAccessToken()` from Privy
4. **Send to API** → Token included in Authorization header
5. **Backend receives** → Authenticated request with user token

### 📤 **API Request Headers**

Every request to `/chat/send` now includes:

```http
POST /chat/send HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 🔧 **Technical Implementation**

#### 1. **API Service** (`src/services/api.ts`)
```typescript
async sendMessage(
  message: string, 
  sessionId?: string, 
  conversationHistory?: Array<{role: 'user' | 'assistant'; content: string}>,
  model?: AIModelKey,
  accessToken?: string  // New parameter for Privy token
): Promise<ChatResponse> {
  // Prepare headers with authentication
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  // Add Privy access token if available
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  
  // Log the request with auth status
  console.log('🚀 Sending API request with model endpoint:', modelEndpoint, 'Auth token:', accessToken ? 'Present' : 'Missing')
  
  const response = await api.post<ChatResponse>('/chat/send', requestData, { headers })
  return response.data
}
```

#### 2. **Chat Store** (`src/stores/chatStore.ts`)
```typescript
sendMessage: async (content: string, userId?: string, model?: AIModelKey, accessToken?: string) => {
  // ... existing logic ...
  
  console.log('📤 Sending message with model:', finalModel, 'endpoint:', modelEndpoint, 'for user:', finalUserId, 'with auth token:', accessToken ? 'Present' : 'Missing')
  const response = await chatApi.sendMessage(content, sessionId, conversationHistory, finalModel, accessToken)
}
```

#### 3. **ChatView Component** (`src/components/ChatView.tsx`)
```typescript
const { authenticated, user, login, getAccessToken } = usePrivy()

const handleSubmit = async (e: React.FormEvent) => {
  // ... validation logic ...
  
  // Get Privy access token for authentication
  const accessToken = await getAccessToken()
  
  await sendMessage(message, user?.id, undefined, accessToken || undefined)
}

// For suggestion buttons
onClick={async () => {
  const accessToken = await getAccessToken()
  sendMessage(suggestion, user?.id, undefined, accessToken || undefined)
}}
```

### 🎯 **Token Management**

#### Token Retrieval
- **Method**: `getAccessToken()` from Privy hook
- **Returns**: `string | null` (JWT token or null if not authenticated)
- **Handling**: Converted to `undefined` if null for optional parameter

#### Token Usage
- **Header Format**: `Authorization: Bearer <token>`
- **Conditional**: Only added if token is available
- **Logging**: Token presence logged for debugging

#### Token Lifecycle
- **Generated**: When user authenticates with Privy
- **Refreshed**: Automatically by Privy SDK
- **Expires**: Handled by Privy (typically 1 hour)
- **Invalidated**: On logout or session expiry

### 📊 **Logging and Debugging**

#### Console Logs Added
1. **Chat Store**: `📤 Sending message with model: [model] endpoint: [endpoint] for user: [userId] with auth token: [Present/Missing]`
2. **API Service**: `🚀 Sending API request with model endpoint: [endpoint] Auth token: [Present/Missing] Request data: [fullRequest]`

#### Debug Information
- **Token presence**: Clearly logged in console
- **User ID**: Tracked for each request
- **Model endpoint**: Full endpoint path logged
- **Request timing**: Logs before API call

### 🔍 **Verification Steps**

To verify authentication is working:

1. **Open browser console** (F12)
2. **Login to the application** using Privy
3. **Send a message** in the chat
4. **Check console logs** for:
   - `📤 Sending message with model: [model] endpoint: [endpoint] for user: [userId] with auth token: Present`
   - `🚀 Sending API request with model endpoint: [endpoint] Auth token: Present Request data: [fullRequest]`
5. **Check Network tab** in DevTools to see the `Authorization` header

### 🚀 **Backend Integration**

The backend should expect and validate the `Authorization` header:

```javascript
// Backend example
app.post('/chat/send', authenticateToken, (req, res) => {
  const { message, sessionId, conversationHistory, model } = req.body
  const userId = req.user.id // From authenticated token
  
  // Use the model parameter to route to appropriate AI model
  const aiResponse = await processWithModel(message, model, userId)
  
  res.json({ response: aiResponse, timestamp: new Date() })
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }
  
  // Verify Privy JWT token
  jwt.verify(token, process.env.PRIVY_APP_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}
```

### 🔒 **Security Features**

#### Token Security
- **JWT Format**: Standard JSON Web Token
- **Signed**: By Privy with app secret
- **Expires**: Automatic expiration (typically 1 hour)
- **Refresh**: Handled automatically by Privy SDK

#### Request Security
- **HTTPS Only**: Tokens should only be sent over HTTPS in production
- **Header Only**: Token sent in Authorization header, not in body
- **Validation**: Backend validates token signature and expiration

#### User Privacy
- **User ID**: Extracted from token, not sent separately
- **Session Tracking**: Backend can track user sessions via token
- **Rate Limiting**: Can be implemented per authenticated user

### 🎨 **User Experience**

#### Seamless Authentication
- **Automatic**: Token retrieved automatically on each request
- **Transparent**: User doesn't see token handling
- **Reliable**: Privy handles token refresh automatically

#### Error Handling
- **Token Missing**: Request sent without auth (for debugging)
- **Token Invalid**: Backend returns 401/403, frontend can handle
- **Token Expired**: Privy automatically refreshes, retry request

The frontend is now fully configured to send Privy authentication tokens with every API request, ensuring the backend can authenticate and authorize users for chat interactions.
