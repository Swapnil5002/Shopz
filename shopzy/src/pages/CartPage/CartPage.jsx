import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { buildSrcSet, getResponsiveImage } from '../../utils/image'
import {
  clearCart,
  clearSaved,
  moveSavedToCart,
  removeFromCart,
  removeFromSaved,
  saveForLater,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  selectSavedItems,
  setQuantity,
} from '../../store/cartSlice'
import './CartPage.css'

function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
  onSaveForLater,
  onMoveToCart,
  saveLabel,
}) {
  return (
    <li className="cart__item">
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
        <span className="cart__item-price">₹{item.price}</span>

        <div className="cart__item-actions">
          {onQuantityChange && (
            <div className="cart__qty" role="group" aria-label={`Quantity for ${item.name}`}>
              <button
                type="button"
                className="cart__qty-btn"
                aria-label="Decrease quantity"
                disabled={item.quantity <= 1}
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
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
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
          )}

          {onSaveForLater && (
            <button
              type="button"
              className="cart__secondary-action"
              onClick={() => onSaveForLater(item.id)}
            >
              Save for later
            </button>
          )}

          {onMoveToCart && (
            <button
              type="button"
              className="cart__secondary-action cart__secondary-action--primary"
              onClick={() => onMoveToCart(item.id)}
            >
              Move to cart
            </button>
          )}

          <button
            type="button"
            className="cart__remove"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="cart__item-total">
        ₹{(item.price * item.quantity).toFixed(2)}
      </div>
    </li>
  )
}

function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const savedItems = useSelector(selectSavedItems)
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

  if (items.length === 0 && savedItems.length === 0) {
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
        <div className="cart__main">
          {items.length > 0 ? (
            <section className="cart__items" aria-labelledby="cart-items-heading">
              <div className="cart__items-head">
                <h2 id="cart-items-heading" className="cart__section-title">
                  {count} item{count === 1 ? '' : 's'} in cart
                </h2>
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
                  <CartLineItem
                    key={item.id}
                    item={item}
                    onQuantityChange={(id, quantity) =>
                      dispatch(setQuantity({ id, quantity }))
                    }
                    onSaveForLater={(id) => dispatch(saveForLater(id))}
                    onRemove={(id) => dispatch(removeFromCart(id))}
                  />
                ))}
              </ul>
            </section>
          ) : (
            <section className="cart__items cart__items--empty-cart">
              <h2 className="cart__section-title">Your cart is empty</h2>
              <p className="cart__empty-inline">
                Move saved items back to your cart or keep shopping.
              </p>
              <Link to="/" className="cart__continue-inline">
                Continue shopping
              </Link>
            </section>
          )}

          {savedItems.length > 0 && (
            <section className="cart__saved" aria-labelledby="saved-items-heading">
              <div className="cart__items-head">
                <h2 id="saved-items-heading" className="cart__section-title">
                  Saved for later ({savedItems.length})
                </h2>
                <button
                  type="button"
                  className="cart__clear"
                  onClick={() => dispatch(clearSaved())}
                >
                  Clear saved
                </button>
              </div>

              <ul className="cart__list">
                {savedItems.map((item) => (
                  <CartLineItem
                    key={item.id}
                    item={item}
                    onMoveToCart={(id) => dispatch(moveSavedToCart(id))}
                    onRemove={(id) => dispatch(removeFromSaved(id))}
                  />
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="cart__summary">
          <h2 className="cart__summary-title">Order summary</h2>
          <div className="cart__summary-row">
            <span>Subtotal ({count} item{count === 1 ? '' : 's'})</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="cart__summary-row">
            <span>Shipping</span>
            <span className="cart__free">FREE</span>
          </div>
          <div className="cart__summary-row cart__summary-row--total">
            <span>Order total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className="cart__checkout"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
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
