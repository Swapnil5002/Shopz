import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  AUTH_STATUS,
  addAddress,
  clearAuthError,
  deleteAddress,
  logout,
  setDefaultAddress,
  updateAddress,
  updateProfile,
} from '../../store/authSlice'
import {
  EMPTY_ADDRESS,
  formatAddressLines,
  getAddresses,
  validateAddress,
} from '../../utils/addresses'
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

  const [addressFormOpen, setAddressFormOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS)
  const [addressFieldError, setAddressFieldError] = useState('')
  const [addressMessage, setAddressMessage] = useState('')

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

  const addresses = getAddresses(user)
  const isSaving = status === AUTH_STATUS.LOADING

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

  const openAddAddress = () => {
    setEditingAddressId(null)
    setAddressForm({
      ...EMPTY_ADDRESS,
      fullName: user.name ?? '',
      isDefault: addresses.length === 0,
    })
    setAddressFieldError('')
    setAddressMessage('')
    setAddressFormOpen(true)
    dispatch(clearAuthError())
  }

  const openEditAddress = (address) => {
    setEditingAddressId(address.id)
    setAddressForm({
      label: address.label ?? 'Home',
      fullName: address.fullName ?? '',
      phone: address.phone ?? '',
      line1: address.line1 ?? '',
      line2: address.line2 ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      postalCode: address.postalCode ?? '',
      country: address.country ?? 'India',
      isDefault: Boolean(address.isDefault),
    })
    setAddressFieldError('')
    setAddressMessage('')
    setAddressFormOpen(true)
    dispatch(clearAuthError())
  }

  const closeAddressForm = () => {
    setAddressFormOpen(false)
    setEditingAddressId(null)
    setAddressForm(EMPTY_ADDRESS)
    setAddressFieldError('')
  }

  const handleAddressFieldChange = (event) => {
    const { name, value, type, checked } = event.target
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setAddressFieldError('')
  }

  const handleAddressSubmit = async (event) => {
    event.preventDefault()
    const validationError = validateAddress(addressForm)
    if (validationError) {
      setAddressFieldError(validationError)
      return
    }

    const payload = {
      ...addressForm,
      label: addressForm.label.trim() || 'Home',
    }

    const result = editingAddressId
      ? await dispatch(updateAddress({ id: editingAddressId, changes: payload }))
      : await dispatch(addAddress(payload))

    const matched = editingAddressId
      ? updateAddress.fulfilled.match(result)
      : addAddress.fulfilled.match(result)

    if (matched) {
      closeAddressForm()
      setAddressMessage(
        editingAddressId ? 'Address updated.' : 'Address added.',
      )
    }
  }

  const handleSetDefault = async (addressId) => {
    setAddressMessage('')
    const result = await dispatch(setDefaultAddress(addressId))
    if (setDefaultAddress.fulfilled.match(result)) {
      setAddressMessage('Default shipping address updated.')
    }
  }

  const handleDeleteAddress = async (addressId) => {
    const confirmed = window.confirm('Delete this address?')
    if (!confirmed) return

    setAddressMessage('')
    const result = await dispatch(deleteAddress(addressId))
    if (deleteAddress.fulfilled.match(result)) {
      if (editingAddressId === addressId) {
        closeAddressForm()
      }
      setAddressMessage('Address deleted.')
    }
  }

  const initial = (user.name || user.email || '?').charAt(0).toUpperCase()

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
            <Link to="/orders" className="profile__btn">
              Order history
            </Link>
            <button type="button" className="profile__btn profile__btn--danger" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </div>

      <section className="profile__card profile__addresses" aria-labelledby="address-book-heading">
        <div className="profile__section-header">
          <div>
            <h2 id="address-book-heading" className="profile__section-title">
              Address book
            </h2>
            <p className="profile__section-copy">
              Save shipping addresses and pick a default for checkout.
            </p>
          </div>
          {!addressFormOpen && (
            <button
              type="button"
              className="profile__btn profile__btn--primary"
              onClick={openAddAddress}
            >
              Add address
            </button>
          )}
        </div>

        {addressMessage && !addressFormOpen && (
          <p className="profile__success" role="status">
            {addressMessage}
          </p>
        )}

        {addressFormOpen && (
          <form className="profile__address-form" onSubmit={handleAddressSubmit} noValidate>
            <h3 className="profile__form-title">
              {editingAddressId ? 'Edit address' : 'New address'}
            </h3>

            {addressFieldError && (
              <p className="profile__error" role="alert">
                {addressFieldError}
              </p>
            )}

            <div className="profile__field-row">
              <div className="profile__field">
                <label className="profile__label" htmlFor="address-label">
                  Label
                </label>
                <input
                  id="address-label"
                  className="profile__input"
                  name="label"
                  value={addressForm.label}
                  onChange={handleAddressFieldChange}
                  placeholder="Home, Work…"
                />
              </div>
              <div className="profile__field">
                <label className="profile__label" htmlFor="address-fullName">
                  Full name
                </label>
                <input
                  id="address-fullName"
                  className="profile__input"
                  name="fullName"
                  value={addressForm.fullName}
                  onChange={handleAddressFieldChange}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="profile__field">
              <label className="profile__label" htmlFor="address-phone">
                Phone
              </label>
              <input
                id="address-phone"
                className="profile__input"
                name="phone"
                value={addressForm.phone}
                onChange={handleAddressFieldChange}
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="10-digit mobile number"
              />
            </div>

            <div className="profile__field">
              <label className="profile__label" htmlFor="address-line1">
                Address line 1
              </label>
              <input
                id="address-line1"
                className="profile__input"
                name="line1"
                value={addressForm.line1}
                onChange={handleAddressFieldChange}
                required
                autoComplete="address-line1"
              />
            </div>

            <div className="profile__field">
              <label className="profile__label" htmlFor="address-line2">
                Address line 2 <span className="profile__optional">(optional)</span>
              </label>
              <input
                id="address-line2"
                className="profile__input"
                name="line2"
                value={addressForm.line2}
                onChange={handleAddressFieldChange}
                autoComplete="address-line2"
              />
            </div>

            <div className="profile__field-row profile__field-row--3">
              <div className="profile__field">
                <label className="profile__label" htmlFor="address-city">
                  City
                </label>
                <input
                  id="address-city"
                  className="profile__input"
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressFieldChange}
                  required
                  autoComplete="address-level2"
                />
              </div>
              <div className="profile__field">
                <label className="profile__label" htmlFor="address-state">
                  State
                </label>
                <input
                  id="address-state"
                  className="profile__input"
                  name="state"
                  value={addressForm.state}
                  onChange={handleAddressFieldChange}
                  required
                  autoComplete="address-level1"
                />
              </div>
              <div className="profile__field">
                <label className="profile__label" htmlFor="address-postalCode">
                  Postal code
                </label>
                <input
                  id="address-postalCode"
                  className="profile__input"
                  name="postalCode"
                  value={addressForm.postalCode}
                  onChange={handleAddressFieldChange}
                  required
                  autoComplete="postal-code"
                />
              </div>
            </div>

            <div className="profile__field">
              <label className="profile__label" htmlFor="address-country">
                Country
              </label>
              <input
                id="address-country"
                className="profile__input"
                name="country"
                value={addressForm.country}
                onChange={handleAddressFieldChange}
                required
                autoComplete="country-name"
              />
            </div>

            <label className="profile__check">
              <input
                type="checkbox"
                name="isDefault"
                checked={addressForm.isDefault}
                onChange={handleAddressFieldChange}
              />
              Set as default shipping address
            </label>

            <div className="profile__actions">
              <button
                type="submit"
                className="profile__btn profile__btn--primary"
                disabled={isSaving}
              >
                {isSaving
                  ? 'Saving…'
                  : editingAddressId
                    ? 'Save address'
                    : 'Add address'}
              </button>
              <button type="button" className="profile__btn" onClick={closeAddressForm}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {!addressFormOpen && addresses.length === 0 && (
          <p className="profile__empty">
            No saved addresses yet. Add one to speed up checkout.
          </p>
        )}

        {addresses.length > 0 && (
          <ul className="profile__address-list">
            {addresses.map((address) => (
              <li
                key={address.id}
                className={`profile__address-item${address.isDefault ? ' profile__address-item--default' : ''}`}
              >
                <div className="profile__address-top">
                  <span className="profile__address-label">{address.label || 'Address'}</span>
                  {address.isDefault && (
                    <span className="profile__default-badge">Default</span>
                  )}
                </div>
                <div className="profile__address-body">
                  {formatAddressLines(address).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <div className="profile__address-actions">
                  {!address.isDefault && (
                    <button
                      type="button"
                      className="profile__btn profile__btn--ghost"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isSaving}
                    >
                      Set default
                    </button>
                  )}
                  <button
                    type="button"
                    className="profile__btn profile__btn--ghost"
                    onClick={() => openEditAddress(address)}
                    disabled={isSaving}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="profile__btn profile__btn--ghost profile__btn--danger-text"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={isSaving}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default ProfilePage
