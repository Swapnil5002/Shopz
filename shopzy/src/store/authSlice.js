import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginRequest, registerRequest, updateUserRequest } from '../api/auth'

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

const initialState = {
  user: loadUser(),
  status: AUTH_STATUS.IDLE,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.status = AUTH_STATUS.IDLE
      state.error = null
      persistUser(null)
    },
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
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
