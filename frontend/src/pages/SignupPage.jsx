import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, resendOtp, verifyEmail } from '../api/auth'
import AuthShell from '../components/AuthShell'
import { Alert, Field, SubmitButton } from '../components/FormControls'

function SignupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('details') // 'details' | 'verify'
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    grade: '',
  })
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)

  function update(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function handleRegister(event) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setLoading(true)
    try {
      await register(form)
      setStep('verify')
      setNotice(`We sent a 6-digit code to ${form.email}.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await verifyEmail({ email: form.email, code: code.trim() })
      navigate('/login', {
        replace: true,
        state: { from: { pathname: '/topics' } },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError(null)
    setNotice(null)
    try {
      await resendOtp({ email: form.email })
      setNotice('A new code is on its way.')
    } catch (err) {
      setError(err.message)
    }
  }

  if (step === 'verify') {
    return (
      <AuthShell
        title="Verify your email"
        subtitle={`Enter the code we sent to ${form.email}.`}
        footer={
          <button
            type="button"
            onClick={() => setStep('details')}
            className="font-semibold text-indigo-700 hover:text-indigo-900"
          >
            ← Use a different email
          </button>
        }
      >
        <form onSubmit={handleVerify} className="space-y-4">
          <Alert>{error}</Alert>
          <Alert variant="success">{notice}</Alert>
          <Field
            label="Verification code"
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <SubmitButton loading={loading}>Verify & continue</SubmitButton>
          <button
            type="button"
            onClick={handleResend}
            className="w-full text-center text-sm font-medium text-indigo-700 hover:text-indigo-900"
          >
            Didn’t get it? Resend code
          </button>
        </form>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start learning with ConceptFlow."
      footer={
        <span>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-700 hover:text-indigo-900">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <Alert>{error}</Alert>
        <Alert variant="success">{notice}</Alert>
        <Field
          label="Full name"
          id="name"
          autoComplete="name"
          required
          value={form.name}
          onChange={update('name')}
        />
        <Field
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={update('email')}
        />
        <Field
          label="Password"
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          hint="At least 8 characters."
          value={form.password}
          onChange={update('password')}
        />
        <Field
          label="Grade (optional)"
          id="grade"
          placeholder="e.g. 10"
          value={form.grade}
          onChange={update('grade')}
        />
        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>
    </AuthShell>
  )
}

export default SignupPage
