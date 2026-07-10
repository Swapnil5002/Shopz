import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const NAV_ITEMS = [
  { label: 'Women', to: '/women' },
  { label: 'Men', to: '/men' },
  { label: 'Electronics', to: '/electronics' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

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
      </nav>
    </header>
  )
}

export default Header
