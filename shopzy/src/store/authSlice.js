import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  loginRequest,
  logoutRequest,
  registerRequest,
  updateUserRequest,
} from '../api/auth'
import {
  createAddressId,
  getAddresses,
  normalizeAddresses,
} from '../utils/addresses'

export const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
}

const STORAGE_KEY = 'shopzy_user'

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistUser(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    /* ignore storage errors */
  }
}

export const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      return await registerRequest(payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      return await loginRequest(payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    await logoutRequest(getState().auth.user)
  },
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      return await updateUserRequest(id, changes)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

async function persistAddresses(userId, addresses, rejectWithValue) {
  try {
    return await updateUserRequest(userId, {
      addresses: normalizeAddresses(addresses),
    })
  } catch (error) {
    return rejectWithValue(error.message)
  }
}

export const addAddress = createAsyncThunk(
  'auth/addAddress',
  async (addressInput, { getState, rejectWithValue }) => {
    const user = getState().auth.user
    if (!user) {
      return rejectWithValue('You must be signed in to save an address.')
    }

    const current = getAddresses(user)
    const newAddress = {
      ...addressInput,
      id: createAddressId(),
      label: String(addressInput.label ?? 'Home').trim() || 'Home',
      fullName: String(addressInput.fullName ?? '').trim(),
      phone: String(addressInput.phone ?? '').trim(),
      line1: String(addressInput.line1 ?? '').trim(),
      line2: String(addressInput.line2 ?? '').trim(),
      city: String(addressInput.city ?? '').trim(),
      state: String(addressInput.state ?? '').trim(),
      postalCode: String(addressInput.postalCode ?? '').trim(),
      country: String(addressInput.country ?? 'India').trim() || 'India',
      isDefault: Boolean(addressInput.isDefault) || current.length === 0,
    }

    const addresses = newAddress.isDefault
      ? [
          ...current.map((item) => ({ ...item, isDefault: false })),
          newAddress,
        ]
      : [...current, newAddress]

    return persistAddresses(user.id, addresses, rejectWithValue)
  },
)

export const updateAddress = createAsyncThunk(
  'auth/updateAddress',
  async ({ id, changes }, { getState, rejectWithValue }) => {
    const user = getState().auth.user
    if (!user) {
      return rejectWithValue('You must be signed in to update an address.')
    }

    const current = getAddresses(user)
    if (!current.some((item) => item.id === id)) {
      return rejectWithValue('Address not found.')
    }

    const makeDefault = Boolean(changes.isDefault)
    const addresses = current.map((item) => {
      if (item.id !== id) {
        return makeDefault ? { ...item, isDefault: false } : item
      }
      return {
        ...item,
        ...changes,
        id,
        label: String(changes.label ?? item.label ?? 'Home').trim() || 'Home',
        fullName: String(changes.fullName ?? item.fullName ?? '').trim(),
        phone: String(changes.phone ?? item.phone ?? '').trim(),
        line1: String(changes.line1 ?? item.line1 ?? '').trim(),
        line2: String(changes.line2 ?? item.line2 ?? '').trim(),
        city: String(changes.city ?? item.city ?? '').trim(),
        state: String(changes.state ?? item.state ?? '').trim(),
        postalCode: String(changes.postalCode ?? item.postalCode ?? '').trim(),
        country:
          String(changes.country ?? item.country ?? 'India').trim() || 'India',
        isDefault: makeDefault ? true : item.isDefault,
      }
    })

    return persistAddresses(user.id, addresses, rejectWithValue)
  },
)

export const deleteAddress = createAsyncThunk(
  'auth/deleteAddress',
  async (addressId, { getState, rejectWithValue }) => {
    const user = getState().auth.user
    if (!user) {
      return rejectWithValue('You must be signed in to delete an address.')
    }

    const addresses = getAddresses(user).filter((item) => item.id !== addressId)
    return persistAddresses(user.id, addresses, rejectWithValue)
  },
)

export const setDefaultAddress = createAsyncThunk(
  'auth/setDefaultAddress',
  async (addressId, { getState, rejectWithValue }) => {
    const user = getState().auth.user
    if (!user) {
      return rejectWithValue('You must be signed in to set a default address.')
    }

    const current = getAddresses(user)
    if (!current.some((item) => item.id === addressId)) {
      return rejectWithValue('Address not found.')
    }

    return persistAddresses(
      user.id,
      normalizeAddresses(current, addressId),
      rejectWithValue,
    )
  },
)

const initialState = {
  user: loadUser(),
  status: AUTH_STATUS.IDLE,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    const onPending = (state) => {
      state.status = AUTH_STATUS.LOADING
      state.error = null
    }
    const onRejected = (state, action) => {
      state.status = AUTH_STATUS.ERROR
      state.error = action.payload ?? 'Something went wrong. Please try again.'
    }
    const onAuthenticated = (state, action) => {
      state.status = AUTH_STATUS.IDLE
      state.user = action.payload
      state.error = null
      persistUser(action.payload)
    }
    const clearAuth = (state) => {
      state.user = null
      state.status = AUTH_STATUS.IDLE
      state.error = null
      persistUser(null)
    }

    builder
      .addCase(register.pending, onPending)
      .addCase(register.fulfilled, onAuthenticated)
      .addCase(register.rejected, onRejected)
      .addCase(login.pending, onPending)
      .addCase(login.fulfilled, onAuthenticated)
      .addCase(login.rejected, onRejected)
      .addCase(updateProfile.pending, onPending)
      .addCase(updateProfile.fulfilled, onAuthenticated)
      .addCase(updateProfile.rejected, onRejected)
      .addCase(addAddress.pending, onPending)
      .addCase(addAddress.fulfilled, onAuthenticated)
      .addCase(addAddress.rejected, onRejected)
      .addCase(updateAddress.pending, onPending)
      .addCase(updateAddress.fulfilled, onAuthenticated)
      .addCase(updateAddress.rejected, onRejected)
      .addCase(deleteAddress.pending, onPending)
      .addCase(deleteAddress.fulfilled, onAuthenticated)
      .addCase(deleteAddress.rejected, onRejected)
      .addCase(setDefaultAddress.pending, onPending)
      .addCase(setDefaultAddress.fulfilled, onAuthenticated)
      .addCase(setDefaultAddress.rejected, onRejected)
      .addCase(logout.fulfilled, clearAuth)
      .addCase(logout.rejected, clearAuth)
  },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer
