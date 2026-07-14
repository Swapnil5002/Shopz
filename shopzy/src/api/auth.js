const USERS_URL = "/api/users";
const LOGOUTS_URL = "/api/logouts";

function stripPassword(user) {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
}

async function findUsersByEmail(email) {
  const response = await fetch(
    `${USERS_URL}?email=${encodeURIComponent(email)}`,
  );
  if (!response.ok) {
    throw new Error("Unable to reach the server. Please try again.");
  }
  return response.json();
}

export async function registerRequest({ name, email, password }) {
  const existing = await findUsersByEmail(email);
  if (existing.length > 0) {
    throw new Error("An account with this email already exists.");
  }

  const response = await fetch(USERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    throw new Error("Registration failed. Please try again.");
  }

  return stripPassword(await response.json());
}

export async function loginRequest({ email, password }) {
  const users = await findUsersByEmail(email);
  const user = users.find((candidate) => candidate.password === password);
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  return stripPassword(user);
}

export async function logoutRequest(user) {
  // Records the logout server-side. In a real backend this endpoint would also
  // invalidate the session / revoke the auth token.
  const response = await fetch(LOGOUTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user?.id ?? null,
      email: user?.email ?? null,
      at: new Date().toISOString(),
    }),
  });
  if (!response.ok) {
    throw new Error("Logout request failed.");
  }
  return response.json();
}

export async function updateUserRequest(id, changes) {
  const response = await fetch(`${USERS_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  if (!response.ok) {
    throw new Error("Could not update your profile. Please try again.");
  }

  return stripPassword(await response.json());
}
