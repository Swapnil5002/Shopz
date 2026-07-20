/** Format amount stored in minor units (paise/cents) as rupees. */
export function formatOrderTotal(amountTotal) {
  if (amountTotal == null) return '—'
  return (amountTotal / 100).toFixed(2)
}

export function formatOrderDate(isoDate) {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function orderBelongsToUser(order, user) {
  if (!order || !user) return false
  if (order.userId && user.id && String(order.userId) === String(user.id)) {
    return true
  }
  if (
    order.email &&
    user.email &&
    order.email.toLowerCase() === user.email.toLowerCase()
  ) {
    return true
  }
  return false
}
