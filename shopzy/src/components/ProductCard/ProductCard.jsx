import { memo } from 'react'
import { Link } from 'react-router-dom'
import { getResponsiveImage } from '../../utils/image'
import './ProductCard.css'

const CARD_WIDTHS = [200, 300, 400, 600]
const CARD_SIZES = '(max-width: 480px) 100vw, (max-width: 900px) 45vw, 300px'

function ProductCard({ product, onAddToCart }) {
  const { id, name, category, price, originalPrice, rating, reviews, badge, bg, image } = product
  const responsive = getResponsiveImage(image, { width: 400, widths: CARD_WIDTHS })

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
            onClick={() => onAddToCart?.(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default memo(ProductCard)
