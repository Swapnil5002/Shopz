import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchProductById } from '../../api/products'
import { addToCart } from '../../store/cartSlice'
import { buildSrcSet, getResponsiveImage } from '../../utils/image'
import './ProductDetailPage.css'

const PDP_MAIN_WIDTHS = [400, 600, 800, 1000]
const PDP_MAIN_SIZES = '(max-width: 900px) 100vw, 480px'

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

function buildGallery(bg) {
  const angles = ['160deg', '25deg', '300deg', '90deg']
  if (!bg || !/\d+deg/.test(bg)) {
    return [bg]
  }
  return angles.map((angle) => bg.replace(/\d+deg/, angle))
}

function formatDeliveryDate(daysFromNow) {
  return new Date(Date.now() + daysFromNow * 86400000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function Stars({ rating }) {
  const full = Math.round(rating)
  return (
    <span className="pdp__stars" aria-hidden="true">
      {'★'.repeat(full)}
      {'☆'.repeat(Math.max(0, 5 - full))}
    </span>
  )
}

function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState(STATUS.LOADING)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    let active = true

    setStatus(STATUS.LOADING)
    setJustAdded(false)
    fetchProductById(id)
      .then((data) => {
        if (!active) return
        if (!data) {
          setStatus(STATUS.NOT_FOUND)
          return
        }
        setProduct(data)
        setSelectedColor(data.colors?.[0] ?? '')
        setSelectedSize(data.sizes?.[0] ?? '')
        setQuantity(1)
        setActiveImage(0)
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

  useEffect(() => {
    if (!justAdded) return undefined
    const timer = setTimeout(() => setJustAdded(false), 2500)
    return () => clearTimeout(timer)
  }, [justAdded])

  if (status === STATUS.LOADING) {
    return (
      <div className="pdp">
        <p className="pdp__status" role="status">
          Loading product…
        </p>
      </div>
    )
  }

  if (status === STATUS.ERROR) {
    return (
      <div className="pdp">
        <p className="pdp__status pdp__status--error" role="alert">
          Something went wrong while loading this product. Please try again later.
        </p>
        <Link to="/" className="pdp__back">
          ← Back to home
        </Link>
      </div>
    )
  }

  if (status === STATUS.NOT_FOUND) {
    return (
      <div className="pdp">
        <p className="pdp__status" role="status">
          Sorry, we couldn&apos;t find that product.
        </p>
        <Link to="/" className="pdp__back">
          ← Back to home
        </Link>
      </div>
    )
  }

  const {
    name,
    category,
    price,
    originalPrice,
    rating,
    reviews,
    badge,
    bg,
    image,
    brand,
    description,
    material,
    warranty,
    colors = [],
    sizes = [],
    stock,
  } = product

  const savings = originalPrice ? originalPrice - price : 0
  const discountPercent = originalPrice
    ? Math.round((savings / originalPrice) * 100)
    : 0
  const highlights =
    product.highlights ?? CATEGORY_HIGHLIGHTS[category] ?? DEFAULT_HIGHLIGHTS
  const inStock = stock === undefined || stock > 0
  const gallery = buildGallery(bg)
  const deliveryDate = formatDeliveryDate(4)
  const categoryPath = `/${category.toLowerCase()}`

  const handleAddToCart = () => {
    dispatch(addToCart({ id, name, price, bg, image, category, quantity }))
    setJustAdded(true)
  }

  const handleBuyNow = () => {
    dispatch(addToCart({ id, name, price, bg, image, category, quantity }))
    navigate('/cart')
  }

  return (
    <div className="pdp">
      <nav className="pdp__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="pdp__crumb-sep">›</span>
        <Link to={categoryPath}>{category}</Link>
        <span className="pdp__crumb-sep">›</span>
        <span className="pdp__crumb-current">{name}</span>
      </nav>

      <div className="pdp__layout">
        <div className="pdp__gallery">
          <div className="pdp__thumbs" role="group" aria-label="Product images">
            {gallery.map((swatch, index) => (
              <button
                key={swatch}
                type="button"
                className={`pdp__thumb${
                  activeImage === index ? ' pdp__thumb--active' : ''
                }`}
                style={{ background: swatch }}
                aria-label={`View image ${index + 1}`}
                aria-pressed={activeImage === index}
                onMouseEnter={() => setActiveImage(index)}
                onClick={() => setActiveImage(index)}
              >
                {image && (
                  <img
                    src={getResponsiveImage(image, { width: 96 }).src}
                    srcSet={buildSrcSet(image, [48, 96, 144])}
                    sizes="48px"
                    width={48}
                    height={48}
                    alt=""
                    className="pdp__thumb-img"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </button>
            ))}
          </div>
          <div className="pdp__main-image" style={{ background: gallery[activeImage] }}>
            {image && (
              <img
                src={getResponsiveImage(image, { width: 800 }).src}
                srcSet={buildSrcSet(image, PDP_MAIN_WIDTHS)}
                sizes={PDP_MAIN_SIZES}
                alt={name}
                className="pdp__main-img"
                fetchPriority="high"
                decoding="async"
              />
            )}
            {badge && <span className="pdp__badge">{badge}</span>}
            {!image && <span className="pdp__image-note">{name}</span>}
          </div>
        </div>

        <div className="pdp__center">
          <h1 className="pdp__title">{name}</h1>
          {brand && <span className="pdp__brand">Visit the {brand} Store</span>}

          <div className="pdp__rating-row">
            <span className="pdp__rating-num">{rating}</span>
            <Stars rating={rating} />
            <a href="#reviews" className="pdp__rating-count">
              {reviews} ratings
            </a>
          </div>

          <hr className="pdp__rule" />

          {badge && <span className="pdp__deal-badge">{badge}</span>}
          <div className="pdp__price-row">
            {discountPercent > 0 && (
              <span className="pdp__price-discount">-{discountPercent}%</span>
            )}
            <span className="pdp__price">
              <sup className="pdp__price-symbol">₹</sup>
              {price}
            </span>
          </div>
          {originalPrice && (
            <div className="pdp__list-price">
              List Price:{' '}
              <span className="pdp__strike">₹{originalPrice}</span>
            </div>
          )}

          <hr className="pdp__rule" />

          {colors.length > 0 && (
            <div className="pdp__variant">
              <div className="pdp__variant-label">
                Colour: <strong>{selectedColor}</strong>
              </div>
              <div className="pdp__chips" role="group" aria-label="Colour">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`pdp__chip${
                      selectedColor === color ? ' pdp__chip--active' : ''
                    }`}
                    aria-pressed={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="pdp__variant">
              <div className="pdp__variant-label">
                Size: <strong>{selectedSize}</strong>
              </div>
              <div className="pdp__chips" role="group" aria-label="Size">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`pdp__chip pdp__chip--size${
                      selectedSize === size ? ' pdp__chip--active' : ''
                    }`}
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <hr className="pdp__rule" />

          <h2 className="pdp__section-title">About this item</h2>
          <ul className="pdp__about">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <p className="pdp__desc">
            {description ??
              `Elevate your everyday with the ${name}. A Shopzy ${category.toLowerCase()} favourite, crafted for comfort, quality, and lasting style.`}
          </p>
        </div>

        <aside className="pdp__buybox">
          <div className="pdp__buybox-price">
            <sup className="pdp__price-symbol">₹</sup>
            {price}
          </div>

          <p className="pdp__delivery">
            FREE delivery <strong>{deliveryDate}</strong>
          </p>
          <p className="pdp__ship-note">Order within 8 hrs for the earliest delivery</p>

          {inStock ? (
            <p className="pdp__stock-line">In stock</p>
          ) : (
            <p className="pdp__stock-line pdp__stock-line--out">Currently unavailable</p>
          )}

          <label className="pdp__qty">
            Quantity:
            <select
              className="pdp__qty-select"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              disabled={!inStock}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="pdp__add-btn"
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <button
            type="button"
            className="pdp__buy-btn"
            disabled={!inStock}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>

          {justAdded && (
            <p className="pdp__added" role="status">
              ✓ Added to cart · <Link to="/cart">View cart</Link>
            </p>
          )}

          <ul className="pdp__assurance">
            <li>
              <span>Ships from</span>
              <strong>Shopzy</strong>
            </li>
            <li>
              <span>Sold by</span>
              <strong>{brand ?? 'Shopzy'}</strong>
            </li>
            <li>
              <span>Payment</span>
              <strong>Secure transaction</strong>
            </li>
            <li>
              <span>Returns</span>
              <strong>30-day returns</strong>
            </li>
          </ul>
        </aside>
      </div>

      <section className="pdp__details">
        <h2 className="pdp__section-title">Product details</h2>
        <dl className="pdp__specs">
          <div className="pdp__spec">
            <dt>Brand</dt>
            <dd>{brand ?? 'Shopzy'}</dd>
          </div>
          <div className="pdp__spec">
            <dt>Category</dt>
            <dd>{category}</dd>
          </div>
          {material && (
            <div className="pdp__spec">
              <dt>Material</dt>
              <dd>{material}</dd>
            </div>
          )}
          {colors.length > 0 && (
            <div className="pdp__spec">
              <dt>Available colours</dt>
              <dd>{colors.join(', ')}</dd>
            </div>
          )}
          {sizes.length > 0 && (
            <div className="pdp__spec">
              <dt>Available sizes</dt>
              <dd>{sizes.join(', ')}</dd>
            </div>
          )}
          {warranty && (
            <div className="pdp__spec">
              <dt>Warranty</dt>
              <dd>{warranty}</dd>
            </div>
          )}
          <div className="pdp__spec">
            <dt>Customer rating</dt>
            <dd>
              {rating} out of 5 ({reviews} ratings)
            </dd>
          </div>
          <div className="pdp__spec">
            <dt>Availability</dt>
            <dd>
              {inStock
                ? `In stock${typeof stock === 'number' ? ` (${stock} units)` : ''}`
                : 'Out of stock'}
            </dd>
          </div>
          <div className="pdp__spec">
            <dt>ASIN</dt>
            <dd>SKZ-{id}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

export default ProductDetailPage
