import './Footer.css'

const SHOP_LINKS = [
  { label: 'Women', href: '#women' },
  { label: 'Men', href: '#men' },
  { label: 'Electronics', href: '#electronics' },
]

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <a href="/" className="footer__logo">
            Shopzy
          </a>
          <p className="footer__tagline">Your one-stop shop for fashion and tech.</p>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <h2 className="footer__nav-title">Shop</h2>
          <ul className="footer__nav-list">
            {SHOP_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="footer__nav-link">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">&copy; {year} Shopzy. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
