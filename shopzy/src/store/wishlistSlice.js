import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'shopzy_wishlist'

function loadWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistWishlist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch(error) {
    console.log(error, "ERROR IN PERSISTING WISHLIST");
  }
}

const initialState = {
  items: loadWishlist(),
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action) {
      const { id, name, price, originalPrice, bg, image, category, rating, reviews, badge } =
        action.payload
      if (state.items.some((item) => item.id === id)) return

      state.items.push({
        id,
        name,
        price,
        originalPrice,
        bg,
        image,
        category,
        rating,
        reviews,
        badge,
      })
      persistWishlist(state.items)
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
      persistWishlist(state.items)
    },
    toggleWishlist(state, action) {
      const product = action.payload
      const exists = state.items.some((item) => item.id === product.id)
      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id)
      } else {
        const { id, name, price, originalPrice, bg, image, category, rating, reviews, badge } =
          product
        state.items.push({
          id,
          name,
          price,
          originalPrice,
          bg,
          image,
          category,
          rating,
          reviews,
          badge,
        })
      }
      persistWishlist(state.items)
    },
    clearWishlist(state) {
      state.items = []
      persistWishlist(state.items)
    },
  },
})

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } =
  wishlistSlice.actions

export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistCount = (state) => state.wishlist.items.length
export const selectIsWishlisted = (id) => (state) =>
  state.wishlist.items.some((item) => item.id === id)

export default wishlistSlice.reducer
