const USERS_URL = '/api/users'

function stripPassword(user) {
  if (!user) return user
  const { password, ...safeUser } = user
  return safeUser
}

async function findUsersByEmail(email) {
  const response = await fetch(`${USERS_URL}?email=${encodeURIComponent(email)}`)
  if (!response.ok) {
    throw new Error('Unable to reach the server. Please try again.')
  }
  return response.json()
}

export async function registerRequest({ name, email, password }) {
  const existing = await findUsersByEmail(email)
  if (existing.length > 0) {
    throw new Error('An account with this email already exists.')
  }

  const response = await fetch(USERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  if (!response.ok) {
    throw new Error('Registration failed. Please try again.')
  }

  return stripPassword(await response.json())
}

export async function loginRequest({ email, password }) {
  const users = await findUsersByEmail(email)
  const user = users.find((candidate) => candidate.password === password)
  if (!user) {
    throw new Error('Invalid email or password.')
  }

  return stripPassword(user)
}

export async function updateUserRequest(id, changes) {
  const response = await fetch(`${USERS_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  })
  if (!response.ok) {
    throw new Error('Could not update your profile. Please try again.')
  }

  return stripPassword(await response.json())
}
