import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartCount, selectCartItems, selectCartTotal } from '../store/cartSlice'
import { CHECKOUT_MODE, createCheckoutSession } from '../api/checkout'
import './CheckoutPage.css'

function CheckoutPage() {
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const total = useSelector(selectCartTotal)
  const user = useSelector((state) => state.auth.user)

  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const handlePay = async (event) => {
    event.preventDefault()
    setProcessing(true)
    setError('')

    try {
      const session = await createCheckoutSession(items)
      navigate('/checkout/success', {
        replace: true,
        state: {
          order: {
            id: session.id,
            amountTotal: session.amountTotal,
            count,
          },
        },
      })
    } catch (err) {
      setError(err.message || 'Payment could not be completed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="checkout">
      <div className="checkout__topbar">
        <Link to="/cart" className="checkout__back">
          ← Back to cart
        </Link>
        <span className="checkout__brand">Shopzy</span>
      </div>

      {CHECKOUT_MODE === 'mock' && (
        <p className="checkout__test-banner" role="status">
          Test mode — this is a mock Stripe checkout. No real payment is taken.
          Use any details (e.g. card <strong>4242 4242 4242 4242</strong>).
        </p>
      )}

      <div className="checkout__layout">
        <form className="checkout__form" onSubmit={handlePay}>
          <h1 className="checkout__title">Pay with card</h1>

          {error && (
            <p className="checkout__error" role="alert">
              {error}
            </p>
          )}

          <label className="checkout__field">
            <span className="checkout__label">Email</span>
            <input
              className="checkout__input"
              type="email"
              defaultValue={user?.email ?? ''}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="checkout__field">
            <span className="checkout__label">Card number</span>
            <input
              className="checkout__input"
              inputMode="numeric"
              defaultValue="4242 4242 4242 4242"
              placeholder="1234 1234 1234 1234"
              autoComplete="cc-number"
            />
          </label>

          <div className="checkout__field-row">
            <label className="checkout__field">
              <span className="checkout__label">Expiry</span>
              <input
                className="checkout__input"
                defaultValue="12 / 34"
                placeholder="MM / YY"
                autoComplete="cc-exp"
              />
            </label>
            <label className="checkout__field">
              <span className="checkout__label">CVC</span>
              <input
                className="checkout__input"
                defaultValue="123"
                placeholder="CVC"
                autoComplete="cc-csc"
              />
            </label>
          </div>

          <label className="checkout__field">
            <span className="checkout__label">Name on card</span>
            <input
              className="checkout__input"
              defaultValue={user?.name ?? ''}
              placeholder="Full name"
              autoComplete="cc-name"
            />
          </label>

          <button type="submit" className="checkout__pay" disabled={processing}>
            {processing ? 'Processing…' : `Pay $${total.toFixed(2)}`}
          </button>

          <p className="checkout__secure">
            <span aria-hidden="true">🔒</span> Payments are securely processed by
            Stripe.
          </p>
        </form>

        <aside className="checkout__summary">
          <h2 className="checkout__summary-title">
            Order summary ({count} item{count === 1 ? '' : 's'})
          </h2>
          <ul className="checkout__items">
            {items.map((item) => (
              <li key={item.id} className="checkout__item">
                <span
                  className="checkout__item-media"
                  style={{ background: item.bg }}
                  aria-hidden="true"
                />
                <span className="checkout__item-name">
                  {item.name}
                  <span className="checkout__item-qty">Qty {item.quantity}</span>
                </span>
                <span className="checkout__item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="checkout__summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="checkout__summary-row">
            <span>Shipping</span>
            <span className="checkout__free">FREE</span>
          </div>
          <div className="checkout__summary-row checkout__summary-row--total">
            <span>Total due</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CheckoutPage
