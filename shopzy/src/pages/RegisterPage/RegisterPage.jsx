import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AUTH_STATUS, clearAuthError, register } from '../../store/authSlice'
import '../AuthPages.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const status = useSelector((state) => state.auth.status)
  const error = useSelector((state) => state.auth.error)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [fieldError, setFieldError] = useState('')

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFieldError('')

    if (!form.name.trim()) {
      setFieldError('Please enter your name.')
      return
    }
    if (!EMAIL_PATTERN.test(form.email)) {
      setFieldError('Please enter a valid email address.')
      return
    }
    if (form.password.length < 6) {
      setFieldError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setFieldError('Passwords do not match.')
      return
    }

    const result = await dispatch(
      register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      }),
    )
    if (register.fulfilled.match(result)) {
      navigate('/profile')
    }
  }

  const isSubmitting = status === AUTH_STATUS.LOADING

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Create your account</h1>
        <p className="auth__subtitle">Join Shopzy for a faster checkout.</p>

        {(fieldError || error) && (
          <p className="auth__error" role="alert">
            {fieldError || error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth__field">
            <label className="auth__label" htmlFor="register-name">
              Name
            </label>
            <input
              id="register-name"
              className="auth__input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
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
            <label className="auth__label" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              className="auth__input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="register-confirm">
              Confirm password
            </label>
            <input
              id="register-confirm"
              className="auth__input"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="auth__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="auth__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth__link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
