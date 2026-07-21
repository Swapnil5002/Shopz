import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './productsSlice'
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import wishlistReducer from './wishlistSlice'
import toastReducer from './toastSlice'
import { toastListenerMiddleware } from './toastListeners'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(toastListenerMiddleware.middleware),
})
