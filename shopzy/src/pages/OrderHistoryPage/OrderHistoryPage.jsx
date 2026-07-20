import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { fetchOrders } from '../../api/orders'
import {
  formatOrderDate,
  formatOrderTotal,
} from '../../utils/orders'
import './OrderHistoryPage.css'

function OrderHistoryPage() {
  const user = useSelector((state) => state.auth.user)
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadOrders() {
      setStatus('loading')
      setError('')

      try {
        const data = await fetchOrders(user?.email)
        if (!active) return

        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
        setOrders(sorted)
        setStatus(sorted.length === 0 ? 'empty' : 'ready')
      } catch (err) {
        if (!active) return
        setError(err.message || 'Could not load your orders.')
        setStatus('error')
      }
    }

    if (user?.email) {
      loadOrders()
    } else {
      setStatus('empty')
    }

    return () => {
      active = false
    }
  }, [user?.email])

  return (
    <div className="orders">
      <div className="orders__header">
        <div>
          <Link to="/profile" className="orders__back">
            ← Back to profile
          </Link>
          <h1 className="orders__title">Order history</h1>
          <p className="orders__subtitle">
            View past purchases and open any order for details.
          </p>
        </div>
      </div>

      {status === 'loading' && (
        <p className="orders__status" role="status">
          Loading your orders…
        </p>
      )}

      {status === 'error' && (
        <p className="orders__status orders__status--error" role="alert">
          {error}
        </p>
      )}

      {status === 'empty' && (
        <div className="orders__empty">
          <p>You haven&apos;t placed any orders yet.</p>
          <Link to="/" className="orders__shop-link">
            Start shopping
          </Link>
        </div>
      )}

      {status === 'ready' && (
        <ul className="orders__list">
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/orders/${order.id}`} className="orders__card">
                <div className="orders__card-top">
                  <span className="orders__ref">{order.id}</span>
                  <span className="orders__status-badge">
                    {order.status ?? 'paid'}
                  </span>
                </div>
                <div className="orders__card-meta">
                  <span>{formatOrderDate(order.createdAt)}</span>
                  <span>
                    {order.count} item{order.count === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="orders__card-total">
                  ₹{formatOrderTotal(order.amountTotal)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default OrderHistoryPage
