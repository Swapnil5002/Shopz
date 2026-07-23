import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchProductById, fetchProducts } from '../api/products'
import {
  PRODUCT_STATUS,
  categoryKey,
  statusFromItems,
} from '../constants/productStatus'

const EMPTY_LIST = Object.freeze({
  items: [],
  status: PRODUCT_STATUS.LOADING,
  error: null,
})

const EMPTY_DETAIL = Object.freeze({
  item: null,
  status: PRODUCT_STATUS.LOADING,
  error: null,
})

export { EMPTY_LIST, EMPTY_DETAIL }

function findProductInLists(lists, id) {
  for (const entry of Object.values(lists)) {
    const match = entry.items?.find((product) => String(product.id) === String(id))
    if (match) return match
  }
  return null
}

export const loadProducts = createAsyncThunk(
  'products/loadList',
  async (category) => {
    const items = await fetchProducts(category || undefined)
    return { key: categoryKey(category), items }
  },
  {
    condition(category, { getState }) {
      const key = categoryKey(category)
      const entry = getState().products.lists[key]
      if (!entry) return true
      return entry.status === PRODUCT_STATUS.ERROR
    },
  },
)

export const loadProductById = createAsyncThunk(
  'products/loadById',
  async (id, { getState }) => {
    const cached = findProductInLists(getState().products.lists, id)
    if (cached) {
      return { id, item: cached }
    }
    const item = await fetchProductById(id)
    return { id, item }
  },
  {
    condition(id, { getState }) {
      const detail = getState().products.details[id]
      if (detail?.status === PRODUCT_STATUS.LOADING) return false
      if (detail?.item) return false
      return true
    },
  },
)

const initialState = {
  lists: {},
  details: {},
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state, action) => {
        const key = categoryKey(action.meta.arg)
        state.lists[key] = {
          items: state.lists[key]?.items ?? [],
          status: PRODUCT_STATUS.LOADING,
          error: null,
        }
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        const { key, items } = action.payload
        state.lists[key] = {
          items,
          status: statusFromItems(items),
          error: null,
        }
        for (const product of items) {
          state.details[product.id] = {
            item: product,
            status: PRODUCT_STATUS.IDLE,
            error: null,
          }
        }
      })
      .addCase(loadProducts.rejected, (state, action) => {
        const key = categoryKey(action.meta.arg)
        state.lists[key] = {
          items: [],
          status: PRODUCT_STATUS.ERROR,
          error: action.error.message ?? 'Failed to load products',
        }
      })
      .addCase(loadProductById.pending, (state, action) => {
        const id = action.meta.arg
        state.details[id] = {
          item: state.details[id]?.item ?? null,
          status: PRODUCT_STATUS.LOADING,
          error: null,
        }
      })
      .addCase(loadProductById.fulfilled, (state, action) => {
        const { id, item } = action.payload
        state.details[id] = {
          item,
          status: item ? PRODUCT_STATUS.IDLE : PRODUCT_STATUS.NOT_FOUND,
          error: null,
        }
      })
      .addCase(loadProductById.rejected, (state, action) => {
        const id = action.meta.arg
        state.details[id] = {
          item: null,
          status: PRODUCT_STATUS.ERROR,
          error: action.error.message ?? 'Failed to load product',
        }
      })
  },
})

export const selectProductList = (category) => (state) =>
  state.products.lists[categoryKey(category)] ?? EMPTY_LIST

export const selectProductDetail = (id) => (state) =>
  (id ? state.products.details[id] : null) ?? EMPTY_DETAIL

export default productsSlice.reducer
