import { useEffect, useState } from 'react'
import { fetchProducts } from '../api/products'
import { PRODUCT_STATUS } from '../pages/HomePage/HomePage'

export function useProducts(category) {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState(PRODUCT_STATUS.LOADING)

  useEffect(() => {
    let active = true

    setStatus(PRODUCT_STATUS.LOADING)
    fetchProducts(category)
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
  }, [category])

  return { products, status }
}
