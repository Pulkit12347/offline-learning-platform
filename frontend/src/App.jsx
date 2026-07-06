import { Navigate, Route, Routes } from 'react-router-dom'
import TopicDetailPage from './pages/TopicDetailPage'
import TopicsPage from './pages/TopicsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/topics" replace />} />
      <Route path="/topics" element={<TopicsPage />} />
      <Route path="/topics/:topicId" element={<TopicDetailPage />} />
      <Route path="*" element={<Navigate to="/topics" replace />} />
    </Routes>
  )
}

export default App
