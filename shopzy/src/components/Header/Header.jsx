import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/authSlice'
import './Header.css'

const NAV_ITEMS = [
  { label: 'Women', to: '/women' },
  { label: 'Men', to: '/men' },
  { label: 'Electronics', to: '/electronics' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    dispatch(logout())
    closeMenu()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header__bar">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <svg
            className="header__logo-icon"
            viewBox="0 0 24 24"
            width="26"
            height="26"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M6 8h12l-1 11a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 19L6 8Z"
              fill="currentColor"
              opacity="0.15"
            />
            <path
              d="M6 8h12l-1 11a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 19L6 8Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M9 9V7a3 3 0 0 1 6 0v2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="header__logo-text">Shopzy</span>
        </Link>

        <button
          type="button"
          className="header__menu-btn"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="header__menu-icon" aria-hidden="true" />
        </button>
      </div>

      <nav
        id="main-nav"
        className={`header__nav${menuOpen ? ' header__nav--open' : ''}`}
        aria-label="Main navigation"
      >
        <ul className="header__nav-list">
          {NAV_ITEMS.map(({ label, to }) => (
            <li key={label}>
              <Link to={to} className="header__nav-link" onClick={closeMenu}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="header__nav-list header__nav-list--auth">
          {user ? (
            <>
              <li>
                <Link to="/profile" className="header__nav-link" onClick={closeMenu}>
                  {user.name || 'Profile'}
                </Link>
              </li>
              <li>
                <button type="button" className="header__auth-btn" onClick={handleLogout}>
                  Log out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="header__nav-link" onClick={closeMenu}>
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="header__auth-btn header__auth-btn--primary"
                  onClick={closeMenu}
                >
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
