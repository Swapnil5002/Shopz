const ORDERS_URL = '/api/orders'

export async function createOrder(order) {
  const response = await fetch(ORDERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
  if (!response.ok) {
    throw new Error('Could not save your order. Please try again.')
  }
  return response.json()
}

export async function fetchOrders(email) {
  const query = email ? `?email=${encodeURIComponent(email)}` : ''
  const response = await fetch(`${ORDERS_URL}${query}`)
  if (!response.ok) {
    throw new Error('Could not load your orders.')
  }
  return response.json()
}

export async function fetchOrderById(id) {
  const response = await fetch(`${ORDERS_URL}/${encodeURIComponent(id)}`)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error('Could not load this order.')
  }
  return response.json()
}
