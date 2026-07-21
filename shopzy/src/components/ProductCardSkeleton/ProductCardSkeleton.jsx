import './ProductCardSkeleton.css'

function ProductCardSkeleton() {
  return (
    <article className="product-skeleton" aria-hidden="true">
      <div className="product-skeleton__media" />
      <div className="product-skeleton__body">
        <div className="product-skeleton__line product-skeleton__line--title" />
        <div className="product-skeleton__line product-skeleton__line--short" />
        <div className="product-skeleton__footer">
          <div className="product-skeleton__line product-skeleton__line--price" />
          <div className="product-skeleton__btn" />
        </div>
      </div>
    </article>
  )
}

export default ProductCardSkeleton
