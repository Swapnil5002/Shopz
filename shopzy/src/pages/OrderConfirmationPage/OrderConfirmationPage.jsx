import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from '../../store/cartSlice'
import '../CheckoutPage/CheckoutPage.css'

function OrderConfirmationPage() {
  const location = useLocation()
  const dispatch = useDispatch()
  const order = location.state?.order

  useEffect(() => {
    if (order) {
      dispatch(clearCart())
    }
  }, [dispatch, order])

  if (!order) {
    return (
      <div className="confirmation">
        <h1 className="confirmation__title">No recent order</h1>
        <p className="confirmation__text">
          You haven&apos;t placed an order yet.
        </p>
        <Link to="/" className="confirmation__btn">
          Continue shopping
        </Link>
      </div>
    )
  }

  const total = (order.amountTotal / 100).toFixed(2)

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
          <span>Items</span>
          <strong>
            {order.count} item{order.count === 1 ? '' : 's'}
          </strong>
        </div>
        <div className="confirmation__row">
          <span>Amount paid</span>
          <strong>${total}</strong>
        </div>
      </div>

      <Link to="/" className="confirmation__btn">
        Continue shopping
      </Link>
    </div>
  )
}

export default OrderConfirmationPage
