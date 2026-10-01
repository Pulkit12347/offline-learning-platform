import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import AuthShell from '../components/AuthShell'
import { Alert, Field, SubmitButton } from '../components/FormControls'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname ?? '/topics'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await loginRequest({ email, password })
      login(data.access_token, data.user)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue learning."
      footer={
        <span>
          New to ConceptFlow?{' '}
          <Link to="/signup" className="font-semibold text-indigo-700 hover:text-indigo-900">
            Create an account
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert>{error}</Alert>
        <Field
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <Field
            label="Password"
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-1.5 text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-indigo-700 hover:text-indigo-900"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>
    </AuthShell>
  )
}

export default LoginPage
