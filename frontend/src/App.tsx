import { Routes, Route, Navigate } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import AdminPage from './pages/AdminPage'
import SetupPage from './pages/SetupPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:sessionId" element={<ChatPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
