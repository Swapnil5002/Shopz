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
          Shopzy
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
