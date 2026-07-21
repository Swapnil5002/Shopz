import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getResponsiveImage } from '../../utils/image'
import { selectIsWishlisted, toggleWishlist } from '../../store/wishlistSlice'
import './ProductCard.css'

const CARD_WIDTHS = [200, 300, 400, 600]
const CARD_SIZES = '(max-width: 480px) 100vw, (max-width: 900px) 45vw, 300px'

function ProductCard({ product, onAddToCart, onMoveToCart }) {
  const { id, name, category, price, originalPrice, rating, reviews, badge, bg, image } = product
  const responsive = getResponsiveImage(image, { width: 400, widths: CARD_WIDTHS })
  const dispatch = useDispatch()
  const isWishlisted = useSelector(selectIsWishlisted(id))

  const handleWishlistClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch(toggleWishlist(product))
  }

  return (
    <article className="product-card">
      <Link to={`/product/${id}`} className="product-card__media-link" aria-label={`View ${name}`}>
        <div className="product-card__media" style={{ background: bg }}>
          {responsive && (
            <img
              src={responsive.src}
              srcSet={responsive.srcSet}
              sizes={CARD_SIZES}
              alt={name}
              className="product-card__image"
              loading="lazy"
              decoding="async"
            />
          )}
          {badge && <span className="product-card__badge">{badge}</span>}
          <span className="product-card__category">{category}</span>
        </div>
      </Link>

      <button
        type="button"
        className={`product-card__wish${isWishlisted ? ' product-card__wish--active' : ''}`}
        aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
        aria-pressed={isWishlisted}
        onClick={handleWishlistClick}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <path
            d="M12 21s-6.5-4.35-9.2-8.2C1.1 10.5 1.5 7.2 4 5.5 6.1 4.1 8.7 4.6 10.2 6.3L12 8.3l1.8-2C15.3 4.6 17.9 4.1 20 5.5c2.5 1.7 2.9 5 1.2 7.3C18.5 16.65 12 21 12 21Z"
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="product-card__body">
        <h3 className="product-card__name">
          <Link to={`/product/${id}`} className="product-card__name-link">
            {name}
          </Link>
        </h3>

        <div className="product-card__rating" aria-label={`Rated ${rating} out of 5`}>
          <span className="product-card__stars" aria-hidden="true">★ {rating}</span>
          <span className="product-card__reviews">({reviews})</span>
        </div>

        <div className="product-card__footer">
          <div className="product-card__prices">
            <span className="product-card__price">₹{price}</span>
            {originalPrice && (
              <span className="product-card__original">₹{originalPrice}</span>
            )}
          </div>
          <button
            type="button"
            className="product-card__btn"
            onClick={() =>
              onMoveToCart ? onMoveToCart(product) : onAddToCart?.(product)
            }
          >
            {onMoveToCart ? 'Move to cart' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default memo(ProductCard)
