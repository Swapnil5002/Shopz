export const EMPTY_ADDRESS = {
  label: 'Home',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  isDefault: false,
}

export function createAddressId() {
  return `addr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function getAddresses(user) {
  return Array.isArray(user?.addresses) ? user.addresses : []
}

export function getDefaultAddress(user) {
  const addresses = getAddresses(user)
  return addresses.find((address) => address.isDefault) ?? addresses[0] ?? null
}

export function formatAddressLines(address) {
  if (!address) return []
  return [
    address.fullName,
    address.line1,
    address.line2,
    [address.city, address.state, address.postalCode].filter(Boolean).join(', '),
    address.country,
    address.phone ? `Phone: ${address.phone}` : '',
  ].filter(Boolean)
}

/** Ensure exactly one default when the list is non-empty. */
export function normalizeAddresses(addresses, preferredDefaultId = null) {
  if (!addresses.length) return []

  const preferred =
    preferredDefaultId &&
    addresses.some((address) => address.id === preferredDefaultId)
      ? preferredDefaultId
      : (addresses.find((address) => address.isDefault)?.id ?? addresses[0].id)

  return addresses.map((address) => ({
    ...address,
    isDefault: address.id === preferred,
  }))
}

export function validateAddress(address) {
  const required = [
    ['fullName', 'Full name'],
    ['phone', 'Phone'],
    ['line1', 'Address line 1'],
    ['city', 'City'],
    ['state', 'State'],
    ['postalCode', 'Postal code'],
    ['country', 'Country'],
  ]

  for (const [key, label] of required) {
    if (!String(address[key] ?? '').trim()) {
      return `${label} is required.`
    }
  }

  const phone = String(address.phone).replace(/\s+/g, '')
  if (!/^\+?\d{10,15}$/.test(phone)) {
    return 'Enter a valid phone number (10–15 digits).'
  }

  return null
}
