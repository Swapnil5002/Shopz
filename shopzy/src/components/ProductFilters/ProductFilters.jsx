import { memo } from 'react'
import './ProductFilters.css'

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
]

export const PRICE_OPTIONS = [
  { value: 'all', label: 'Any price' },
  { value: 'under-50', label: 'Under ₹50', min: 0, max: 50 },
  { value: '50-100', label: '₹50 to ₹100', min: 50, max: 100 },
  { value: '100-200', label: '₹100 to ₹200', min: 100, max: 200 },
  { value: '200-plus', label: '₹200 & up', min: 200, max: Infinity },
]

export const RATING_OPTIONS = [
  { value: 'all', label: 'Any rating' },
  { value: '4.5', label: '4.5★ & up', min: 4.5 },
  { value: '4', label: '4★ & up', min: 4 },
  { value: '3', label: '3★ & up', min: 3 },
]

function ProductFilters({
  categories,
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
  price = 'all',
  onPriceChange,
  rating = 'all',
  onRatingChange,
  onSale = false,
  onOnSaleChange,
  onReset,
  resultCount,
}) {
  const hasActiveFilters =
    activeCategory !== 'all' ||
    price !== 'all' ||
    rating !== 'all' ||
    onSale ||
    sort !== 'featured'

  return (
    <div className="product-filters">
      <div
        className="product-filters__categories"
        role="group"
        aria-label="Filter by category"
      >
        <button
          type="button"
          className={`product-filters__chip${activeCategory === 'all' ? ' product-filters__chip--active' : ''}`}
          aria-pressed={activeCategory === 'all'}
          onClick={() => onCategoryChange('all')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`product-filters__chip${activeCategory === category ? ' product-filters__chip--active' : ''}`}
            aria-pressed={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="product-filters__controls">
        <label className="product-filters__field">
          <span className="product-filters__field-label">Price</span>
          <select
            className="product-filters__select"
            value={price}
            onChange={(event) => onPriceChange?.(event.target.value)}
          >
            {PRICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="product-filters__field">
          <span className="product-filters__field-label">Rating</span>
          <select
            className="product-filters__select"
            value={rating}
            onChange={(event) => onRatingChange?.(event.target.value)}
          >
            {RATING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="product-filters__field">
          <span className="product-filters__field-label">Sort by</span>
          <select
            className="product-filters__select"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className={`product-filters__toggle${onSale ? ' product-filters__toggle--active' : ''}`}
          aria-pressed={onSale}
          onClick={() => onOnSaleChange?.(!onSale)}
        >
          On sale
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            className="product-filters__reset"
            onClick={onReset}
          >
            Clear all
          </button>
        )}
      </div>

      {typeof resultCount === 'number' && (
        <p className="product-filters__count" role="status" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'product' : 'products'}
        </p>
      )}
    </div>
  )
}

export default memo(ProductFilters)
