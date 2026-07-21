import ProductCardSkeleton from './ProductCardSkeleton'
import './ProductCardSkeleton.css'

function ProductGridSkeleton({ count = 8, variant = 'home' }) {
  return (
    <div
      className={`product-grid-skeleton${variant === 'category' ? ' product-grid-skeleton--category' : ''}`}
      role="status"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default ProductGridSkeleton
