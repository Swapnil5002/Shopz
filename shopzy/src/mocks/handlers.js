import { http, HttpResponse } from 'msw'
import { PRODUCTS } from '../data/products'

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json(PRODUCTS)
  }),
]
