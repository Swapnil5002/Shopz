export const PRODUCT_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  EMPTY: 'empty',
  NOT_FOUND: 'not-found',
}

export function statusFromItems(items) {
  return items.length === 0 ? PRODUCT_STATUS.EMPTY : PRODUCT_STATUS.IDLE
}

export function categoryKey(category) {
  return category || 'all'
}
