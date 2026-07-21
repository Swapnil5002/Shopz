import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dismissToast } from '../../store/toastSlice'
import './Toast.css'

function ToastItem({ toast }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch(dismissToast(toast.id))
    }, toast.duration)

    return () => window.clearTimeout(timer)
  }, [dispatch, toast.duration, toast.id])

  return (
    <div
      className={`toast toast--${toast.variant}`}
      role="status"
      aria-live="polite"
    >
      <span className="toast__message">{toast.message}</span>
      <button
        type="button"
        className="toast__close"
        aria-label="Dismiss notification"
        onClick={() => dispatch(dismissToast(toast.id))}
      >
        ×
      </button>
    </div>
  )
}

function ToastContainer() {
  const toasts = useSelector((state) => state.toast.items)

  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default ToastContainer
