import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it, vi } from 'vitest'
import HomePage from './HomePage'
import { PRODUCT_STATUS } from '../../constants/productStatus'
import wishlistReducer from '../../store/wishlistSlice'
import productsReducer from '../../store/productsSlice'

const sampleProduct = {
  id: 99,
  name: 'Test Product',
  category: 'Women',
  price: 25,
  rating: 4.2,
  reviews: 10,
  bg: 'linear-gradient(160deg, #fff 0%, #eee 100%)',
}

function renderHome(props = {}) {
  const store = configureStore({
    reducer: { wishlist: wishlistReducer, products: productsReducer },
  })
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <HomePage {...props} />
      </MemoryRouter>
    </Provider>,
  )
}

describe('HomePage', () => {
  it('renders featured products in the default idle state', () => {
    renderHome({ products: [sampleProduct] })

    expect(screen.getByRole('heading', { name: 'Featured products' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Test Product' })).toBeInTheDocument()
  })

  it('shows loading skeletons', () => {
    renderHome({ products: [], productsStatus: PRODUCT_STATUS.LOADING })

    expect(screen.getByLabelText('Loading products')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Add to cart' })).not.toBeInTheDocument()
  })

  it('shows error state', () => {
    renderHome({ products: [], productsStatus: PRODUCT_STATUS.ERROR })

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i)
  })

  it('shows empty state', () => {
    renderHome({ products: [], productsStatus: PRODUCT_STATUS.EMPTY })

    expect(screen.getByText(/no products found/i)).toBeInTheDocument()
  })

  it('shows required email error when subscribing with empty input', async () => {
    const user = userEvent.setup()
    renderHome({ products: [sampleProduct] })

    await user.click(screen.getByRole('button', { name: 'Subscribe' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Email is required.')
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    renderHome({ products: [sampleProduct] })

    await user.type(screen.getByLabelText('Email address'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Subscribe' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid email address.')
  })

  it('shows success state after valid subscription', async () => {
    const user = userEvent.setup()
    renderHome({ products: [sampleProduct] })

    await user.type(screen.getByLabelText('Email address'), 'shopper@example.com')
    await user.click(screen.getByRole('button', { name: 'Subscribe' }))

    expect(screen.getByText(/thanks for subscribing/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Subscribe' })).not.toBeInTheDocument()
  })

  it('shows error when subscription handler fails', async () => {
    const user = userEvent.setup()
    const onSubscribe = vi.fn().mockRejectedValue(new Error('Network error'))
    renderHome({ products: [sampleProduct], onSubscribe })

    await user.type(screen.getByLabelText('Email address'), 'shopper@example.com')
    await user.click(screen.getByRole('button', { name: 'Subscribe' }))

    expect(onSubscribe).toHaveBeenCalledWith('shopper@example.com')
    expect(screen.getByRole('alert')).toHaveTextContent(/unable to subscribe/i)
  })
})
