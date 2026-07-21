import { createListenerMiddleware } from '@reduxjs/toolkit'
import { addToCart, moveSavedToCart, saveForLater } from './cartSlice'
import { selectIsWishlisted, toggleWishlist } from './wishlistSlice'
import { showToast } from './toastSlice'

export const toastListenerMiddleware = createListenerMiddleware()

toastListenerMiddleware.startListening({
  actionCreator: addToCart,
  effect: (action, listenerApi) => {
    if (action.meta?.skipToast) return
    listenerApi.dispatch(
      showToast({ message: `${action.payload.name} added to cart` }),
    )
  },
})

toastListenerMiddleware.startListening({
  actionCreator: toggleWishlist,
  effect: (action, listenerApi) => {
    const isWishlisted = selectIsWishlisted(action.payload.id)(
      listenerApi.getState(),
    )
    listenerApi.dispatch(
      showToast({
        message: isWishlisted
          ? `${action.payload.name} added to wishlist`
          : `${action.payload.name} removed from wishlist`,
      }),
    )
  },
})

toastListenerMiddleware.startListening({
  actionCreator: saveForLater,
  effect: (action, listenerApi) => {
    const item = listenerApi
      .getOriginalState()
      .cart.items.find((entry) => String(entry.id) === String(action.payload))
    if (item) {
      listenerApi.dispatch(
        showToast({ message: `${item.name} saved for later` }),
      )
    }
  },
})

toastListenerMiddleware.startListening({
  actionCreator: moveSavedToCart,
  effect: (action, listenerApi) => {
    const item = listenerApi
      .getOriginalState()
      .cart.saved.find((entry) => String(entry.id) === String(action.payload))
    if (item) {
      listenerApi.dispatch(
        showToast({ message: `${item.name} moved to cart` }),
      )
    }
  },
})
