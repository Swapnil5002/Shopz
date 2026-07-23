import { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { PRODUCT_STATUS, categoryKey } from '../constants/productStatus'
import {
  EMPTY_DETAIL,
  EMPTY_LIST,
  loadProductById,
  loadProducts,
} from '../store/productsSlice'

export function useProducts(category, { enabled = true } = {}) {
  const dispatch = useDispatch()
  const key = categoryKey(category)
  const { items, status, error } = useSelector(
    (state) => state.products.lists[key] ?? EMPTY_LIST,
    shallowEqual,
  )

  useEffect(() => {
    if (!enabled) return
    dispatch(loadProducts(category))
  }, [category, dispatch, enabled])

  return { products: items, status, error }
}

export function useProduct(id, { enabled = true } = {}) {
  const dispatch = useDispatch()
  const { item, status, error } = useSelector(
    (state) => (id ? state.products.details[id] : null) ?? EMPTY_DETAIL,
    shallowEqual,
  )

  useEffect(() => {
    if (!enabled || !id) return
    dispatch(loadProductById(id))
  }, [dispatch, enabled, id])

  return { product: item, status, error }
}

export { PRODUCT_STATUS }
