import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/authSlice'
import { selectCartCount } from '../../store/cartSlice'
import { selectWishlistCount } from '../../store/wishlistSlice'
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
  const cartCount = useSelector(selectCartCount)
  const wishlistCount = useSelector(selectWishlistCount)

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
          <li>
            <Link
              to="/wishlist"
              className="header__wishlist"
              onClick={closeMenu}
              aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? '' : 's'}`}
            >
              <svg
                className="header__wishlist-icon"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M12 21s-6.5-4.35-9.2-8.2C1.1 10.5 1.5 7.2 4 5.5 6.1 4.1 8.7 4.6 10.2 6.3L12 8.3l1.8-2C15.3 4.6 17.9 4.1 20 5.5c2.5 1.7 2.9 5 1.2 7.3C18.5 16.65 12 21 12 21Z"
                  fill={wishlistCount > 0 ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="header__wishlist-label">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="header__wishlist-count" aria-hidden="true">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className="header__cart"
              onClick={closeMenu}
              aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
            >
              <svg
                className="header__cart-icon"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M3 4h2l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 8H6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="20" r="1.4" fill="currentColor" />
                <circle cx="17" cy="20" r="1.4" fill="currentColor" />
              </svg>
              <span className="header__cart-label">Cart</span>
              {cartCount > 0 && (
                <span className="header__cart-count" aria-hidden="true">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </li>
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
