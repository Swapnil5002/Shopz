import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById } from '../../api/orders'
import { clearCart } from '../../store/cartSlice'
import {
  formatOrderDate,
  formatOrderTotal,
  orderBelongsToUser,
} from '../../utils/orders'
import { formatAddressLines } from '../../utils/addresses'
import './OrderDetailPage.css'

function OrderDetailPage() {
  const { orderId } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const cartCleared = useRef(false)
  const fromCheckout = Boolean(location.state?.fromCheckout)

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

        if (fromCheckout && !cartCleared.current) {
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
  }, [dispatch, fromCheckout, orderId, user])

  if (status === 'loading') {
    return (
      <div className="order-detail">
        <div className="order-detail__card order-detail__card--loading" role="status">
          <div className="order-detail__skeleton order-detail__skeleton--title" />
          <div className="order-detail__skeleton order-detail__skeleton--line" />
          <div className="order-detail__skeleton order-detail__skeleton--line" />
          <div className="order-detail__skeleton order-detail__skeleton--block" />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="order-detail">
        <div className="order-detail__card order-detail__card--centered">
          <h1 className="order-detail__title">Something went wrong</h1>
          <p className="order-detail__subtitle">{error}</p>
          <Link to="/orders" className="order-detail__btn">
            View order history
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'not-found' || !order) {
    return (
      <div className="order-detail">
        <div className="order-detail__card order-detail__card--centered">
          <h1 className="order-detail__title">Order not found</h1>
          <p className="order-detail__subtitle">
            We couldn&apos;t find this order, or it isn&apos;t linked to your
            account.
          </p>
          <Link to="/orders" className="order-detail__btn">
            View order history
          </Link>
        </div>
      </div>
    )
  }

  const shippingLines = order.shippingAddress
    ? formatAddressLines(order.shippingAddress)
    : []
  const itemCount =
    order.count ??
    (Array.isArray(order.items)
      ? order.items.reduce((sum, item) => sum + item.quantity, 0)
      : 0)

  return (
    <div className="order-detail">
      <div className="order-detail__topbar">
        <Link to="/orders" className="order-detail__back">
          ← Order history
        </Link>
      </div>

      {fromCheckout && (
        <div className="order-detail__success-banner" role="status">
          <span className="order-detail__success-icon" aria-hidden="true">
            ✓
          </span>
          <div>
            <h1 className="order-detail__success-title">Payment successful</h1>
            <p className="order-detail__success-text">
              Thank you for your order! A confirmation has been sent to your
              email.
            </p>
          </div>
        </div>
      )}

      <div className="order-detail__layout">
        <div className="order-detail__main">
          <section className="order-detail__card" aria-labelledby="order-summary-heading">
            <h2 id="order-summary-heading" className="order-detail__section-title">
              {fromCheckout ? 'Order receipt' : 'Order details'}
            </h2>

            <dl className="order-detail__meta">
              <div className="order-detail__meta-row">
                <dt>Order reference</dt>
                <dd className="order-detail__ref">{order.id}</dd>
              </div>
              <div className="order-detail__meta-row">
                <dt>Placed on</dt>
                <dd>{formatOrderDate(order.createdAt)}</dd>
              </div>
              <div className="order-detail__meta-row">
                <dt>Status</dt>
                <dd>
                  <span className="order-detail__status-badge">
                    {order.status ?? 'paid'}
                  </span>
                </dd>
              </div>
              <div className="order-detail__meta-row">
                <dt>Items</dt>
                <dd>
                  {itemCount} item{itemCount === 1 ? '' : 's'}
                </dd>
              </div>
              <div className="order-detail__meta-row order-detail__meta-row--total">
                <dt>Amount paid</dt>
                <dd>₹{formatOrderTotal(order.amountTotal)}</dd>
              </div>
            </dl>
          </section>

          {Array.isArray(order.items) && order.items.length > 0 && (
            <section
              className="order-detail__card"
              aria-labelledby="order-items-heading"
            >
              <h2 id="order-items-heading" className="order-detail__section-title">
                Items ordered
              </h2>
              <ul className="order-detail__items">
                {order.items.map((item) => (
                  <li key={`${item.id}-${item.name}`} className="order-detail__item">
                    <div className="order-detail__item-info">
                      <Link
                        to={`/product/${item.id}`}
                        className="order-detail__item-name"
                      >
                        {item.name}
                      </Link>
                      <span className="order-detail__item-qty">
                        Qty {item.quantity} · ₹{item.price} each
                      </span>
                    </div>
                    <span className="order-detail__item-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {shippingLines.length > 0 && (
            <section
              className="order-detail__card"
              aria-labelledby="order-shipping-heading"
            >
              <h2 id="order-shipping-heading" className="order-detail__section-title">
                Shipping address
              </h2>
              {order.shippingAddress?.label && (
                <span className="order-detail__address-label">
                  {order.shippingAddress.label}
                </span>
              )}
              <address className="order-detail__address">
                {shippingLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </section>
          )}
        </div>

        <aside className="order-detail__aside">
          <div className="order-detail__card order-detail__card--sticky">
            <h2 className="order-detail__section-title">Need anything else?</h2>
            <p className="order-detail__aside-text">
              You can review all past purchases or keep browsing the store.
            </p>
            <div className="order-detail__actions">
              <Link to="/orders" className="order-detail__btn order-detail__btn--secondary">
                Order history
              </Link>
              <Link to="/" className="order-detail__btn">
                Continue shopping
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default OrderDetailPage
