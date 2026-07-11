import './SearchBar.css'

function SearchBar({ value, onChange, placeholder = 'Search products…', id = 'product-search' }) {
  return (
    <div className="search-bar">
      <label htmlFor={id} className="search-bar__label">
        Search
      </label>
      <div className="search-bar__field">
        <span className="search-bar__icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id={id}
          type="search"
          className="search-bar__input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="search-bar__clear"
            aria-label="Clear search"
            onClick={() => onChange('')}
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
