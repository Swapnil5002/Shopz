import { addToCart } from './cartSlice'
import { removeFromWishlist } from './wishlistSlice'
import { showToast } from './toastSlice'

/** Add wishlist item to cart and remove it from the wishlist in one step. */
export function moveWishlistItemToCart(product) {
  return (dispatch) => {
    dispatch(addToCart({ ...product, quantity: 1, skipToast: true }))
    dispatch(removeFromWishlist(product.id))
    dispatch(showToast({ message: `${product.name} moved to cart` }))
  }
}
