import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ProductCard from './ProductCard'

const baseProduct = {
  id: 1,
  name: 'Silk Wrap Dress',
  category: 'Women',
  price: 89,
  rating: 4.8,
  reviews: 124,
  bg: 'linear-gradient(160deg, #fce7f3 0%, #f9a8d4 100%)',
}

function renderCard(product = baseProduct, props = {}) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} {...props} />
    </MemoryRouter>,
  )
}

describe('ProductCard', () => {
  it('renders product details', () => {
    renderCard()

    expect(screen.getByRole('heading', { name: 'Silk Wrap Dress' })).toBeInTheDocument()
    expect(screen.getByText('₹89')).toBeInTheDocument()
    expect(screen.getByText('Women')).toBeInTheDocument()
    expect(screen.getByLabelText('Rated 4.8 out of 5')).toBeInTheDocument()
  })

  it('links to the product detail page', () => {
    renderCard()

    expect(screen.getByRole('link', { name: 'Silk Wrap Dress' })).toHaveAttribute(
      'href',
      '/product/1',
    )
  })

  it('renders sale badge and original price when provided', () => {
    renderCard({ ...baseProduct, badge: 'Sale', originalPrice: 119 })

    expect(screen.getByText('Sale')).toBeInTheDocument()
    expect(screen.getByText('₹119')).toBeInTheDocument()
  })

  it('does not render badge or original price when omitted', () => {
    renderCard()

    expect(screen.queryByText('Sale')).not.toBeInTheDocument()
    expect(screen.queryByText('₹119')).not.toBeInTheDocument()
  })

  it('calls onAddToCart when add to cart is clicked', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    renderCard(baseProduct, { onAddToCart })

    await user.click(screen.getByRole('button', { name: 'Add to cart' }))

    expect(onAddToCart).toHaveBeenCalledOnce()
    expect(onAddToCart).toHaveBeenCalledWith(baseProduct)
  })
})
