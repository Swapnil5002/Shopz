import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchProducts } from '../api/products'
import { PRODUCT_STATUS } from '../pages/HomePage'

export const loadProducts = createAsyncThunk(
  'products/load',
  async (category) => {
    return fetchProducts(category)
  },
)

const initialState = {
  items: [],
  status: PRODUCT_STATUS.LOADING,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = PRODUCT_STATUS.LOADING
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.items = action.payload
        state.status =
          action.payload.length === 0 ? PRODUCT_STATUS.EMPTY : PRODUCT_STATUS.IDLE
      })
      .addCase(loadProducts.rejected, (state) => {
        state.items = []
        state.status = PRODUCT_STATUS.ERROR
      })
  },
})

export default productsSlice.reducer
