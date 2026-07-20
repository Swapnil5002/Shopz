import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById } from '../../api/orders'
import { clearCart } from '../../store/cartSlice'
import {
  formatOrderDate,
  formatOrderTotal,
  orderBelongsToUser,
} from '../../utils/orders'
import { formatAddressLines } from '../../utils/addresses'
import '../CheckoutPage/CheckoutPage.css'

function OrderConfirmationPage() {
  const { orderId } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const cartCleared = useRef(false)

  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadOrder() {
      setStatus('loading')
      setError('')

      try {
        const data = await fetchOrderById(orderId)
        if (!active) return

        if (!data || !orderBelongsToUser(data, user)) {
          setOrder(null)
          setStatus('not-found')
          return
        }

        setOrder(data)
        setStatus('ready')

        if (!cartCleared.current) {
          dispatch(clearCart())
          cartCleared.current = true
        }
      } catch (err) {
        if (!active) return
        setError(err.message || 'Could not load this order.')
        setStatus('error')
      }
    }

    loadOrder()

    return () => {
      active = false
    }
  }, [dispatch, orderId, user])

  if (status === 'loading') {
    return (
      <div className="confirmation">
        <p className="confirmation__text" role="status">
          Loading your order…
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="confirmation">
        <h1 className="confirmation__title">Something went wrong</h1>
        <p className="confirmation__text">{error}</p>
        <Link to="/orders" className="confirmation__btn">
          View order history
        </Link>
      </div>
    )
  }

  if (status === 'not-found' || !order) {
    return (
      <div className="confirmation">
        <h1 className="confirmation__title">Order not found</h1>
        <p className="confirmation__text">
          We couldn&apos;t find this order, or it isn&apos;t linked to your
          account.
        </p>
        <Link to="/orders" className="confirmation__btn">
          View order history
        </Link>
      </div>
    )
  }

  const shippingLines = order.shippingAddress
    ? formatAddressLines(order.shippingAddress)
    : []

  return (
    <div className="confirmation">
      <div className="confirmation__check" aria-hidden="true">
        ✓
      </div>
      <h1 className="confirmation__title">Payment successful</h1>
      <p className="confirmation__text">
        Thank you for your order! A confirmation has been sent to your email.
      </p>

      <div className="confirmation__receipt">
        <div className="confirmation__row">
          <span>Order reference</span>
          <strong className="confirmation__order-id">{order.id}</strong>
        </div>
        <div className="confirmation__row">
          <span>Placed on</span>
          <strong>{formatOrderDate(order.createdAt)}</strong>
        </div>
        <div className="confirmation__row">
          <span>Status</span>
          <strong className="confirmation__status">{order.status ?? 'paid'}</strong>
        </div>
        <div className="confirmation__row">
          <span>Items</span>
          <strong>
            {order.count} item{order.count === 1 ? '' : 's'}
          </strong>
        </div>
        <div className="confirmation__row">
          <span>Amount paid</span>
          <strong>₹{formatOrderTotal(order.amountTotal)}</strong>
        </div>
      </div>

      {Array.isArray(order.items) && order.items.length > 0 && (
        <div className="confirmation__items">
          <h2 className="confirmation__items-title">Order items</h2>
          <ul className="confirmation__item-list">
            {order.items.map((item) => (
              <li key={`${item.id}-${item.name}`} className="confirmation__item">
                <span className="confirmation__item-name">
                  {item.name}
                  <span className="confirmation__item-qty">Qty {item.quantity}</span>
                </span>
                <span className="confirmation__item-price">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {shippingLines.length > 0 && (
        <div className="confirmation__shipping">
          <h2 className="confirmation__items-title">Ship to</h2>
          {shippingLines.map((line) => (
            <p key={line} className="confirmation__shipping-line">
              {line}
            </p>
          ))}
        </div>
      )}

      <div className="confirmation__actions">
        <Link to="/orders" className="confirmation__btn confirmation__btn--secondary">
          Order history
        </Link>
        <Link to="/" className="confirmation__btn">
          Continue shopping
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
