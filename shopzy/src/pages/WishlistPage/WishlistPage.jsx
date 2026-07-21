import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../../components/ProductCard/ProductCard'
import { moveWishlistItemToCart } from '../../store/wishlistActions'
import {
  clearWishlist,
  selectWishlistCount,
  selectWishlistItems,
} from '../../store/wishlistSlice'
import './WishlistPage.css'

function WishlistPage() {
  const dispatch = useDispatch()
  const items = useSelector(selectWishlistItems)
  const count = useSelector(selectWishlistCount)

  if (items.length === 0) {
    return (
      <div className="wishlist">
        <div className="wishlist__empty">
          <h1 className="wishlist__empty-title">Your wishlist is empty</h1>
          <p className="wishlist__empty-text">
            Tap the heart on products you love and they&apos;ll show up here.
          </p>
          <Link to="/" className="wishlist__empty-btn">
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist">
      <div className="wishlist__header">
        <div>
          <h1 className="wishlist__title">Wishlist</h1>
          <p className="wishlist__subtitle">
            {count} saved item{count === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type="button"
          className="wishlist__clear"
          onClick={() => dispatch(clearWishlist())}
        >
          Clear all
        </button>
      </div>

      <div className="wishlist__grid">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onMoveToCart={(item) => dispatch(moveWishlistItemToCart(item))}
          />
        ))}
      </div>
    </div>
  )
}

export default WishlistPage
