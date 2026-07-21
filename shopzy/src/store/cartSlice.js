import { createSlice } from '@reduxjs/toolkit'

const CART_STORAGE_KEY = 'shopzy_cart'
const SAVED_STORAGE_KEY = 'shopzy_saved'

function loadItems(key) {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistItems(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch {
    /* ignore storage errors */
  }
}

const initialState = {
  items: loadItems(CART_STORAGE_KEY),
  saved: loadItems(SAVED_STORAGE_KEY),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: {
      reducer(state, action) {
        const { id, name, price, bg, image, category, quantity } = action.payload
        const qty = Math.max(1, Number(quantity) || 1)
        const existing = state.items.find((item) => item.id === id)

        if (existing) {
          existing.quantity += qty
        } else {
          state.items.push({ id, name, price, bg, image, category, quantity: qty })
        }

        persistItems(CART_STORAGE_KEY, state.items)
      },
      prepare(payload) {
        const { skipToast, ...item } = payload
        return {
          payload: item,
          meta: { skipToast: Boolean(skipToast) },
        }
      },
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
      persistItems(CART_STORAGE_KEY, state.items)
    },
    setQuantity(state, action) {
      const { id, quantity } = action.payload
      const item = state.items.find((entry) => entry.id === id)
      if (item) {
        item.quantity = Math.max(1, Number(quantity) || 1)
        persistItems(CART_STORAGE_KEY, state.items)
      }
    },
    clearCart(state) {
      state.items = []
      persistItems(CART_STORAGE_KEY, state.items)
    },
    saveForLater(state, action) {
      const id = action.payload
      const item = state.items.find((entry) => String(entry.id) === String(id))
      if (!item) return

      state.items = state.items.filter((entry) => String(entry.id) !== String(id))
      const savedItem = state.saved.find((entry) => String(entry.id) === String(id))

      if (savedItem) {
        savedItem.quantity += item.quantity
      } else {
        state.saved.push({ ...item })
      }

      persistItems(CART_STORAGE_KEY, state.items)
      persistItems(SAVED_STORAGE_KEY, state.saved)
    },
    moveSavedToCart(state, action) {
      const id = action.payload
      const savedItem = state.saved.find((entry) => String(entry.id) === String(id))
      if (!savedItem) return

      state.saved = state.saved.filter((entry) => String(entry.id) !== String(id))
      const cartItem = state.items.find((entry) => String(entry.id) === String(id))

      if (cartItem) {
        cartItem.quantity += savedItem.quantity
      } else {
        state.items.push({ ...savedItem })
      }

      persistItems(CART_STORAGE_KEY, state.items)
      persistItems(SAVED_STORAGE_KEY, state.saved)
    },
    removeFromSaved(state, action) {
      state.saved = state.saved.filter(
        (entry) => String(entry.id) !== String(action.payload),
      )
      persistItems(SAVED_STORAGE_KEY, state.saved)
    },
    clearSaved(state) {
      state.saved = []
      persistItems(SAVED_STORAGE_KEY, state.saved)
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  setQuantity,
  clearCart,
  saveForLater,
  moveSavedToCart,
  removeFromSaved,
  clearSaved,
} = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectSavedItems = (state) => state.cart.saved
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

export default cartSlice.reducer
