import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '../api/products'
import { FEATURES } from '../data/products'
import './ProductDetailPage.css'

const STATUS = {
  LOADING: 'loading',
  IDLE: 'idle',
  ERROR: 'error',
  NOT_FOUND: 'not-found',
}

const CATEGORY_HIGHLIGHTS = {
  Women: [
    'Premium breathable fabric',
    'Tailored, flattering fit',
    'Machine washable',
    'Ethically sourced materials',
  ],
  Men: [
    'Durable everyday construction',
    'Classic, versatile design',
    'Wrinkle-resistant fabric',
    'All-day comfort fit',
  ],
  Electronics: [
    'Latest-generation hardware',
    '1-year manufacturer warranty',
    'Fast charging support',
    'Seamless device pairing',
  ],
}

const DEFAULT_HIGHLIGHTS = [
  'Top-rated by Shopzy shoppers',
  'Backed by our quality guarantee',
  'Fast shipping with easy returns',
]

function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState(STATUS.LOADING)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let active = true

    setStatus(STATUS.LOADING)
    fetchProductById(id)
      .then((data) => {
        if (!active) return
        if (!data) {
          setStatus(STATUS.NOT_FOUND)
          return
        }
        setProduct(data)
        setStatus(STATUS.IDLE)
      })
      .catch(() => {
        if (!active) return
        setStatus(STATUS.ERROR)
      })

    return () => {
      active = false
    }
  }, [id])

  if (status === STATUS.LOADING) {
    return (
      <div className="product-detail">
        <p className="product-detail__status" role="status">
          Loading product…
        </p>
      </div>
    )
  }

  if (status === STATUS.ERROR) {
    return (
      <div className="product-detail">
        <p className="product-detail__status product-detail__status--error" role="alert">
          Something went wrong while loading this product. Please try again later.
        </p>
        <Link to="/" className="product-detail__back">
          ← Back to home
        </Link>
      </div>
    )
  }

  if (status === STATUS.NOT_FOUND) {
    return (
      <div className="product-detail">
        <p className="product-detail__status" role="status">
          Sorry, we couldn&apos;t find that product.
        </p>
        <Link to="/" className="product-detail__back">
          ← Back to home
        </Link>
      </div>
    )
  }

  const { name, category, price, originalPrice, rating, reviews, badge, bg } = product

  const savings = originalPrice ? originalPrice - price : 0
  const discountPercent = originalPrice
    ? Math.round((savings / originalPrice) * 100)
    : 0
  const highlights = CATEGORY_HIGHLIGHTS[category] ?? DEFAULT_HIGHLIGHTS
  const fullStars = Math.round(rating)

  const decreaseQty = () => setQuantity((qty) => Math.max(1, qty - 1))
  const increaseQty = () => setQuantity((qty) => Math.min(10, qty + 1))

  return (
    <div className="product-detail">
      <Link to="/" className="product-detail__back">
        ← Back to home
      </Link>

      <div className="product-detail__grid">
        <div className="product-detail__media" style={{ background: bg }}>
          {badge && <span className="product-detail__badge">{badge}</span>}
        </div>

        <div className="product-detail__info">
          <p className="product-detail__category">{category}</p>
          <h1 className="product-detail__name">{name}</h1>

          <div className="product-detail__meta">
            <div
              className="product-detail__rating"
              aria-label={`Rated ${rating} out of 5`}
            >
              <span className="product-detail__stars" aria-hidden="true">
                {'★'.repeat(fullStars)}
                {'☆'.repeat(Math.max(0, 5 - fullStars))}
              </span>
              <span>{rating}</span>
              <span className="product-detail__reviews">({reviews} reviews)</span>
            </div>
            <span className="product-detail__stock">In stock</span>
          </div>

          <div className="product-detail__prices">
            <span className="product-detail__price">${price}</span>
            {originalPrice && (
              <>
                <span className="product-detail__original">${originalPrice}</span>
                <span className="product-detail__discount">-{discountPercent}%</span>
              </>
            )}
          </div>
          {savings > 0 && (
            <p className="product-detail__savings">
              You save ${savings} ({discountPercent}% off)
            </p>
          )}

          <p className="product-detail__desc">
            Elevate your everyday with the {name}. A Shopzy{' '}
            {category.toLowerCase()} favourite, crafted for comfort, quality, and
            lasting style. Thoughtfully designed and rigorously tested so it looks
            and feels great, wear after wear.
          </p>

          <div className="product-detail__section">
            <h2 className="product-detail__section-title">Highlights</h2>
            <ul className="product-detail__highlights">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="product-detail__purchase">
            <div className="product-detail__qty" role="group" aria-label="Quantity">
              <button
                type="button"
                className="product-detail__qty-btn"
                onClick={decreaseQty}
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="product-detail__qty-value" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                className="product-detail__qty-btn"
                onClick={increaseQty}
                aria-label="Increase quantity"
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
            <button type="button" className="product-detail__btn">
              Add {quantity} to cart · ${price * quantity}
            </button>
          </div>

          <div className="product-detail__section">
            <h2 className="product-detail__section-title">Specifications</h2>
            <dl className="product-detail__specs">
              <div className="product-detail__spec">
                <dt>SKU</dt>
                <dd>SKZ-{id}</dd>
              </div>
              <div className="product-detail__spec">
                <dt>Category</dt>
                <dd>{category}</dd>
              </div>
              <div className="product-detail__spec">
                <dt>Rating</dt>
                <dd>{rating} / 5</dd>
              </div>
              <div className="product-detail__spec">
                <dt>Reviews</dt>
                <dd>{reviews}</dd>
              </div>
              <div className="product-detail__spec">
                <dt>Availability</dt>
                <dd>In stock</dd>
              </div>
            </dl>
          </div>

          <ul className="product-detail__perks">
            {FEATURES.map(({ label, detail }) => (
              <li key={label} className="product-detail__perk">
                <strong>{label}</strong>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
