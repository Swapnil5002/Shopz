/**
 * Stripe Checkout integration seam.
 *
 * This project currently runs in a frontend-only MOCK mode (no real charges).
 * To go live with real Stripe Checkout you need TWO things this repo does not
 * ship with:
 *   1. A backend endpoint that creates a Checkout Session using your Stripe
 *      SECRET key (the secret key must NEVER live in this frontend bundle).
 *   2. Your Stripe PUBLISHABLE key exposed to the frontend via an env var.
 *
 * See `.env.example` for the variables. Flip VITE_CHECKOUT_MODE to "live" and
 * fill in the commented-out code below once the backend exists.
 */

export const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? ''

// 'mock' (default) simulates the payment in-app; 'live' uses real Stripe.
export const CHECKOUT_MODE = import.meta.env.VITE_CHECKOUT_MODE ?? 'mock'

export function centsFromDollars(amount) {
  return Math.round(amount * 100)
}

function toLineItems(items) {
  return items.map((item) => ({
    name: item.name,
    amount: centsFromDollars(item.price),
    currency: 'usd',
    quantity: item.quantity,
  }))
}

/**
 * Create a checkout session for the given cart items.
 *
 * MOCK: resolves after a short delay with a fake "paid" session.
 * LIVE: (scaffolded, commented) calls your backend then redirects to Stripe.
 *
 * @returns {Promise<{ id: string, paymentStatus: string, amountTotal: number,
 *   currency: string, lineItems: Array }>}
 */
export async function createCheckoutSession(items) {
  const amountTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  if (CHECKOUT_MODE === 'live') {
    // ----------------------------------------------------------------------
    // REAL STRIPE CHECKOUT (enable once you have a backend + keys)
    // ----------------------------------------------------------------------
    // 1) Ask your server to create a Checkout Session with the secret key:
    //
    //    const response = await fetch('/api/create-checkout-session', {
    //      method: 'POST',
    //      headers: { 'Content-Type': 'application/json' },
    //      body: JSON.stringify({ items: toLineItems(items) }),
    //    })
    //    if (!response.ok) throw new Error('Could not start checkout.')
    //    const session = await response.json() // { id, url }
    //
    // 2a) Simplest — redirect to the hosted URL Stripe returned:
    //
    //    window.location.href = session.url
    //    return session
    //
    // 2b) Or redirect via @stripe/stripe-js (npm i @stripe/stripe-js):
    //
    //    import { loadStripe } from '@stripe/stripe-js'
    //    const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY)
    //    await stripe.redirectToCheckout({ sessionId: session.id })
    //    return session
    // ----------------------------------------------------------------------
    throw new Error(
      'Live Stripe checkout is not configured yet. Set VITE_CHECKOUT_MODE=live and wire a backend endpoint (see src/api/checkout.js).',
    )
  }

  // --- MOCK MODE: simulate the network + Stripe processing, no real charge ---
  await new Promise((resolve) => setTimeout(resolve, 900))

  return {
    id: `cs_test_mock_${Date.now()}`,
    paymentStatus: 'paid',
    amountTotal: centsFromDollars(amountTotal),
    currency: 'usd',
    lineItems: toLineItems(items),
  }
}
