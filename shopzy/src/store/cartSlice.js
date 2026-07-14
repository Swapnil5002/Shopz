import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'shopzy_cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* ignore storage errors */
  }
}

const initialState = {
  items: loadCart(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { id, name, price, bg, image, category, quantity } = action.payload
      const qty = Math.max(1, Number(quantity) || 1)
      const existing = state.items.find((item) => item.id === id)

      if (existing) {
        existing.quantity += qty
      } else {
        state.items.push({ id, name, price, bg, image, category, quantity: qty })
      }

      persistCart(state.items)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
      persistCart(state.items)
    },
    setQuantity(state, action) {
      const { id, quantity } = action.payload
      const item = state.items.find((entry) => entry.id === id)
      if (item) {
        item.quantity = Math.max(1, Number(quantity) || 1)
        persistCart(state.items)
      }
    },
    clearCart(state) {
      state.items = []
      persistCart(state.items)
    },
  },
})

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

export default cartSlice.reducer
