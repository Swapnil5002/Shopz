import { Link } from 'react-router-dom'
import './Footer.css'

const LINK_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Women', to: '/women' },
      { label: 'Men', to: '/men' },
      { label: 'Electronics', to: '/electronics' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact', href: '#contact' },
      { label: 'Shipping', href: '#shipping' },
      { label: 'Returns', href: '#returns' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
    ],
  },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Twitter', href: 'https://twitter.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
]

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            Shopzy
          </Link>
          <p className="footer__tagline">
            Your one-stop shop for fashion and tech. Curated styles and the
            latest gadgets, delivered to your door.
          </p>
          <ul className="footer__social" aria-label="Social media">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="footer__social-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__columns">
          {LINK_COLUMNS.map(({ title, links }) => (
            <nav key={title} className="footer__nav" aria-label={`${title} links`}>
              <h2 className="footer__nav-title">{title}</h2>
              <ul className="footer__nav-list">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="footer__nav-link">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="footer__nav-link">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          &copy; {year} Shopzy. All rights reserved.
        </p>
        <a href="mailto:support@shopzy.com" className="footer__contact">
          support@shopzy.com
        </a>
      </div>
    </footer>
  )
}

export default Footer
