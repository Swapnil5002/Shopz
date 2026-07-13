import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AUTH_STATUS, clearAuthError, login } from '../store/authSlice'
import './AuthPages.css'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const status = useSelector((state) => state.auth.status)
  const error = useSelector((state) => state.auth.error)

  const redirectTo = location.state?.from ?? '/profile'

  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await dispatch(login(form))
    if (login.fulfilled.match(result)) {
      navigate(redirectTo, { replace: true })
    }
  }

  const isSubmitting = status === AUTH_STATUS.LOADING

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__subtitle">Log in to your Shopzy account.</p>

        {error && (
          <p className="auth__error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth__field">
            <label className="auth__label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="auth__input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="auth__input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="auth__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth__footer">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth__link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
