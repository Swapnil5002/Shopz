import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { buildSrcSet, getResponsiveImage } from '../../utils/image'
import {
  clearCart,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  setQuantity,
} from '../../store/cartSlice'
import './CartPage.css'

function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const total = useSelector(selectCartTotal)
  const user = useSelector((state) => state.auth.user)

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="cart">
        <div className="cart__empty">
          <h1 className="cart__empty-title">Your cart is empty</h1>
          <p className="cart__empty-text">
            Browse our collections and add something you love.
          </p>
          <Link to="/" className="cart__empty-btn">
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart">
      <h1 className="cart__title">Shopping Cart</h1>

      <div className="cart__layout">
        <div className="cart__items">
          <div className="cart__items-head">
            <span>
              {count} item{count === 1 ? '' : 's'}
            </span>
            <button
              type="button"
              className="cart__clear"
              onClick={() => dispatch(clearCart())}
            >
              Clear cart
            </button>
          </div>

          <ul className="cart__list">
            {items.map((item) => (
              <li key={item.id} className="cart__item">
                <Link
                  to={`/product/${item.id}`}
                  className="cart__item-media"
                  style={{ background: item.bg }}
                  aria-label={`View ${item.name}`}
                >
                  {item.image && (
                    <img
                      src={getResponsiveImage(item.image, { width: 96 }).src}
                      srcSet={buildSrcSet(item.image, [96, 192, 288])}
                      sizes="96px"
                      width={96}
                      height={96}
                      alt={item.name}
                      className="cart__item-img"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </Link>

                <div className="cart__item-info">
                  <Link to={`/product/${item.id}`} className="cart__item-name">
                    {item.name}
                  </Link>
                  {item.category && (
                    <span className="cart__item-category">{item.category}</span>
                  )}
                  <span className="cart__item-price">${item.price}</span>

                  <div className="cart__item-actions">
                    <div className="cart__qty" role="group" aria-label={`Quantity for ${item.name}`}>
                      <button
                        type="button"
                        className="cart__qty-btn"
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          dispatch(setQuantity({ id: item.id, quantity: item.quantity - 1 }))
                        }
                      >
                        −
                      </button>
                      <span className="cart__qty-value" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="cart__qty-btn"
                        aria-label="Increase quantity"
                        onClick={() =>
                          dispatch(setQuantity({ id: item.id, quantity: item.quantity + 1 }))
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart__remove"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart__item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="cart__summary">
          <h2 className="cart__summary-title">Order summary</h2>
          <div className="cart__summary-row">
            <span>Subtotal ({count} item{count === 1 ? '' : 's'})</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="cart__summary-row">
            <span>Shipping</span>
            <span className="cart__free">FREE</span>
          </div>
          <div className="cart__summary-row cart__summary-row--total">
            <span>Order total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button type="button" className="cart__checkout" onClick={handleCheckout}>
            {user ? 'Proceed to checkout' : 'Sign in to checkout'}
          </button>
          {!user && (
            <p className="cart__signin-note">
              You&apos;ll need to sign in to complete your order.
            </p>
          )}
          <Link to="/" className="cart__continue">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}

export default CartPage
