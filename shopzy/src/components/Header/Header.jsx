import { useState } from 'react'
import './Header.css'

const NAV_ITEMS = [
  { label: 'Women', href: '#women' },
  { label: 'Men', href: '#men' },
  { label: 'Electronics', href: '#electronics' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header">
      <div className="header__bar">
        <a href="/" className="header__logo" onClick={closeMenu}>
          Shopzy
        </a>

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
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className="header__nav-link" onClick={closeMenu}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
