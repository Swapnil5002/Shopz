import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Header from './Header'

describe('Header', () => {
  it('renders logo and navigation links', () => {
    render(<Header />)

    expect(screen.getByRole('link', { name: 'Shopzy' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Women' })).toHaveAttribute('href', '#women')
    expect(screen.getByRole('link', { name: 'Men' })).toHaveAttribute('href', '#men')
    expect(screen.getByRole('link', { name: 'Electronics' })).toHaveAttribute('href', '#electronics')
  })

  it('starts with the mobile menu closed', () => {
    render(<Header />)

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).not.toHaveClass('header__nav--open')
  })

  it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup()
    render(<Header />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toHaveClass('header__nav--open')

    await user.click(screen.getByRole('button', { name: 'Close menu' }))

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the menu when a nav link is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(screen.getByRole('link', { name: 'Women' }))

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
  })
})
