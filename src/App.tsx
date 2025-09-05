import { Routes, Route, useParams } from 'react-router-dom'
import ChatView from './components/ChatView'
import SharedChatView from './components/SharedChatView'

function SharedChatWrapper() {
  const { shareId } = useParams<{ shareId: string }>()
  return <SharedChatView shareId={shareId || ''} />
}

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<ChatView />} />
        <Route path="/shared/:shareId" element={<SharedChatWrapper />} />
      </Routes>
    </div>
  )
}

export default App 