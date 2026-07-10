import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard/ProductCard'
import { fetchProducts } from '../api/products'
import { PRODUCT_STATUS } from './HomePage'
import './CategoryPage.css'

const CATEGORY_META = {
  women: { label: 'Women', tagline: 'Dresses, tops & everyday essentials' },
  men: { label: 'Men', tagline: 'Shirts, denim & activewear' },
  electronics: { label: 'Electronics', tagline: 'Phones, audio & smart gadgets' },
}

function titleCase(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function CategoryPage() {
  const { category } = useParams()
  const key = (category ?? '').toLowerCase()
  const meta = CATEGORY_META[key]
  const label = meta?.label ?? titleCase(key)

  const [products, setProducts] = useState([])
  const [status, setStatus] = useState(PRODUCT_STATUS.LOADING)

  useEffect(() => {
    let active = true

    setStatus(PRODUCT_STATUS.LOADING)
    fetchProducts(label)
      .then((data) => {
        if (!active) return
        setProducts(data)
        setStatus(data.length === 0 ? PRODUCT_STATUS.EMPTY : PRODUCT_STATUS.IDLE)
      })
      .catch(() => {
        if (!active) return
        setStatus(PRODUCT_STATUS.ERROR)
      })

    return () => {
      active = false
    }
  }, [label])

  return (
    <div className="category">
      <section className="category__hero">
        <p className="category__eyebrow">Shop the collection</p>
        <h1 className="category__title">{label}</h1>
        <p className="category__subtitle">
          {meta?.tagline ?? 'Browse our latest picks in this category.'}
        </p>
        <Link to="/" className="category__back">
          ← Back to home
        </Link>
      </section>

      <section className="category__content">
        {status === PRODUCT_STATUS.LOADING && (
          <p className="category__status" role="status">
            Loading {label} products…
          </p>
        )}

        {status === PRODUCT_STATUS.ERROR && (
          <p className="category__status category__status--error" role="alert">
            Something went wrong while loading products. Please try again later.
          </p>
        )}

        {status === PRODUCT_STATUS.EMPTY && (
          <p className="category__status" role="status">
            No {label} products found. Check back soon for new arrivals.
          </p>
        )}

        {status === PRODUCT_STATUS.IDLE && (
          <div className="category__products">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default CategoryPage
