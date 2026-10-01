import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AboutPage from './pages/AboutPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import TopicDetailPage from './pages/TopicDetailPage'
import TopicsPage from './pages/TopicsPage'

function App() {
  return (
    <Routes>
      {/* Auth pages render without the app navbar. */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* App pages share the navbar layout. */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/topics" replace />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/topics/:topicId" element={<TopicDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/topics" replace />} />
    </Routes>
  )
}

export default App
