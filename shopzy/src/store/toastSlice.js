import { createSlice } from '@reduxjs/toolkit'

const TOAST_DURATION_MS = 3200

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    items: [],
  },
  reducers: {
    showToast(state, action) {
      const id = crypto.randomUUID()
      state.items.push({
        id,
        message: action.payload.message,
        variant: action.payload.variant ?? 'success',
        duration: action.payload.duration ?? TOAST_DURATION_MS,
      })
    },
    dismissToast(state, action) {
      state.items = state.items.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { showToast, dismissToast } = toastSlice.actions
export default toastSlice.reducer
