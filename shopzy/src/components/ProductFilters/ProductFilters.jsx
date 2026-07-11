import { memo } from 'react'
import './ProductFilters.css'

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
]

function ProductFilters({
  categories,
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="product-filters">
      <div className="product-filters__categories" role="group" aria-label="Filter by category">
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

      <label className="product-filters__sort">
        <span className="product-filters__sort-label">Sort by</span>
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
    </div>
  )
}

export default memo(ProductFilters)
