import { useMemo, useState } from 'react'
import ProductCard from '../../components/ProductCard/ProductCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import ProductFilters from '../../components/ProductFilters/ProductFilters'
import { CATEGORIES, FEATURES, PRODUCTS } from '../../data/products'
import { buildSrcSet, getResponsiveImage } from '../../utils/image'
import './HomePage.css'

export const PRODUCT_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  EMPTY: 'empty',
}

export const NEWSLETTER_STATUS = {
  IDLE: 'idle',
  SUCCESS: 'success',
  ERROR: 'error',
}

const CATEGORY_LABELS = CATEGORIES.map((category) => category.label)

function FeaturedProducts({ products, status, onAddToCart }) {
  if (status === PRODUCT_STATUS.LOADING) {
    return (
      <p className="home-products__status" role="status">
        Loading products…
      </p>
    )
  }

  if (status === PRODUCT_STATUS.ERROR) {
    return (
      <p className="home-products__status home-products__status--error" role="alert">
        Something went wrong while loading products. Please try again later.
      </p>
    )
  }

  if (status === PRODUCT_STATUS.EMPTY || products.length === 0) {
    return (
      <p className="home-products__status" role="status">
        No products found. Check back soon for new arrivals.
      </p>
    )
  }

  return (
    <div className="home-products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}

function HomePage({
  products = PRODUCTS,
  productsStatus = PRODUCT_STATUS.IDLE,
  onAddToCart,
  onSubscribe,
}) {
  const [newsletterStatus, setNewsletterStatus] = useState(NEWSLETTER_STATUS.IDLE)
  const [newsletterError, setNewsletterError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sort, setSort] = useState('featured')

  const visibleProducts = useMemo(() => {
    let list = products

    if (activeCategory !== 'all') {
      list = list.filter((product) => product.category === activeCategory)
    }

    const query = searchQuery.trim().toLowerCase()
    if (query) {
      list = list.filter((product) => product.name.toLowerCase().includes(query))
    }

    const sorted = [...list]
    if (sort === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating)
    }

    return sorted
  }, [products, activeCategory, searchQuery, sort])

  const handleSubscribe = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()

    if (!email) {
      setNewsletterError('Email is required.')
      setNewsletterStatus(NEWSLETTER_STATUS.ERROR)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterError('Please enter a valid email address.')
      setNewsletterStatus(NEWSLETTER_STATUS.ERROR)
      return
    }

    try {
      if (onSubscribe) {
        await onSubscribe(email)
      }
      setNewsletterError('')
      setNewsletterStatus(NEWSLETTER_STATUS.SUCCESS)
      event.currentTarget.reset()
    } catch {
      setNewsletterError('Unable to subscribe right now. Please try again.')
      setNewsletterStatus(NEWSLETTER_STATUS.ERROR)
    }
  }

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">New season arrivals</p>
          <h1 className="home-hero__title">Style meets smart shopping</h1>
          <p className="home-hero__text">
            Discover curated fashion for women and men, plus the latest electronics npm run server all in one place.
          </p>
          <div className="home-hero__actions">
            <a href="#featured" className="home-hero__btn home-hero__btn--primary">
              Shop now
            </a>
            <a href="#categories" className="home-hero__btn home-hero__btn--secondary">
              Browse categories
            </a>
          </div>
        </div>
      </section>

      <section className="home-features" aria-label="Store benefits">
        <ul className="home-features__list">
          {FEATURES.map(({ label, detail }) => (
            <li key={label} className="home-features__item">
              <strong>{label}</strong>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="categories" className="home-section">
        <div className="home-section__header">
          <h2 className="home-section__title">Shop by category</h2>
          <p className="home-section__subtitle">Find what you love, faster</p>
        </div>

        <div className="home-categories">
          {CATEGORIES.map(({ id, label, href, description, bg, image }) => (
            <a
              key={id}
              id={id}
              href={href}
              className="home-category"
              style={{ background: bg }}
            >
              {image && (
                <img
                  src={getResponsiveImage(image, { width: 600 }).src}
                  srcSet={buildSrcSet(image, [400, 600, 800])}
                  sizes="(max-width: 700px) 100vw, 33vw"
                  alt={label}
                  className="home-category__image"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span className="home-category__label">{label}</span>
              <span className="home-category__desc">{description}</span>
              <span className="home-category__cta">Shop {label.toLowerCase()} →</span>
            </a>
          ))}
        </div>
      </section>

      <section id="featured" className="home-section">
        <div className="home-section__header home-section__header--row">
          <div>
            <h2 className="home-section__title">Featured products</h2>
            <p className="home-section__subtitle">Hand-picked bestsellers this week</p>
          </div>
          <a href="#featured" className="home-section__link">
            View all
          </a>
        </div>

        {productsStatus === PRODUCT_STATUS.IDLE && (
          <div className="home-products__controls">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <ProductFilters
              categories={CATEGORY_LABELS}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              sort={sort}
              onSortChange={setSort}
            />
          </div>
        )}

        <FeaturedProducts
          products={visibleProducts}
          status={productsStatus}
          onAddToCart={onAddToCart}
        />
      </section>

      <section className="home-promo">
        <div className="home-promo__content">
          <p className="home-promo__eyebrow">Limited time offer</p>
          <h2 className="home-promo__title">Get 20% off your first order</h2>
          <p className="home-promo__text">
            Sign up for exclusive deals on fashion and tech. Use code <code>WELCOME20</code> at checkout.
          </p>

          {newsletterStatus === NEWSLETTER_STATUS.SUCCESS ? (
            <p className="home-promo__success" role="status">
              Thanks for subscribing! Check your inbox for your welcome offer.
            </p>
          ) : (
            <form className="home-promo__form" onSubmit={handleSubscribe} noValidate>
              <div className="home-promo__field">
                <input
                  type="email"
                  name="email"
                  className="home-promo__input"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  aria-invalid={newsletterStatus === NEWSLETTER_STATUS.ERROR}
                  aria-describedby={newsletterError ? 'newsletter-error' : undefined}
                  required
                />
                {newsletterError && (
                  <p id="newsletter-error" className="home-promo__error" role="alert">
                    {newsletterError}
                  </p>
                )}
              </div>
              <button type="submit" className="home-promo__submit">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
