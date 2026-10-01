import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword, resetPassword } from '../api/auth'
import AuthShell from '../components/AuthShell'
import { Alert, Field, SubmitButton } from '../components/FormControls'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('request') // 'request' | 'reset'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleRequest(event) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setLoading(true)
    try {
      await forgotPassword({ email })
      setStep('reset')
      setNotice(`If an account exists for ${email}, a reset code has been sent.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await resetPassword({ email, code: code.trim(), newPassword })
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const footer = (
    <Link to="/login" className="font-semibold text-indigo-700 hover:text-indigo-900">
      ← Back to sign in
    </Link>
  )

  if (step === 'reset') {
    return (
      <AuthShell
        title="Reset password"
        subtitle={`Enter the code sent to ${email} and choose a new password.`}
        footer={footer}
      >
        <form onSubmit={handleReset} className="space-y-4">
          <Alert>{error}</Alert>
          <Alert variant="success">{notice}</Alert>
          <Field
            label="Reset code"
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Field
            label="New password"
            id="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            hint="At least 8 characters."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <SubmitButton loading={loading}>Update password</SubmitButton>
        </form>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we’ll send you a reset code."
      footer={footer}
    >
      <form onSubmit={handleRequest} className="space-y-4">
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
        <SubmitButton loading={loading}>Send reset code</SubmitButton>
      </form>
    </AuthShell>
  )
}

export default ForgotPasswordPage
