import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AUTH_STATUS, clearAuthError, logout, updateProfile } from '../../store/authSlice'
import './ProfilePage.css'

function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const status = useSelector((state) => state.auth.status)
  const error = useSelector((state) => state.auth.error)

  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setForm({ name: user.name ?? '', email: user.email ?? '' })
    }
  }, [user])

  if (!user) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSavedMessage('')
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const result = await dispatch(
      updateProfile({
        id: user.id,
        changes: { name: form.name.trim(), email: form.email.trim() },
      }),
    )
    if (updateProfile.fulfilled.match(result)) {
      setIsEditing(false)
      setSavedMessage('Profile updated successfully.')
    }
  }

  const handleCancel = () => {
    setForm({ name: user.name ?? '', email: user.email ?? '' })
    setIsEditing(false)
    dispatch(clearAuthError())
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const initial = (user.name || user.email || '?').charAt(0).toUpperCase()
  const isSaving = status === AUTH_STATUS.LOADING

  return (
    <div className="profile">
      <div className="profile__card">
        <div className="profile__header">
          <div className="profile__avatar" aria-hidden="true">
            {initial}
          </div>
          <div>
            <h1 className="profile__name">{user.name}</h1>
            <p className="profile__email">{user.email}</p>
          </div>
        </div>

        {error && (
          <p className="profile__error" role="alert">
            {error}
          </p>
        )}
        {savedMessage && !isEditing && (
          <p className="profile__success" role="status">
            {savedMessage}
          </p>
        )}

        {isEditing ? (
          <form className="profile__form" onSubmit={handleSave} noValidate>
            <div className="profile__field">
              <label className="profile__label" htmlFor="profile-name">
                Name
              </label>
              <input
                id="profile-name"
                className="profile__input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile__field">
              <label className="profile__label" htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                className="profile__input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile__actions">
              <button type="submit" className="profile__btn profile__btn--primary" disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save changes'}
              </button>
              <button type="button" className="profile__btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile__actions">
            <button
              type="button"
              className="profile__btn profile__btn--primary"
              onClick={() => setIsEditing(true)}
            >
              Edit profile
            </button>
            <button type="button" className="profile__btn profile__btn--danger" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
