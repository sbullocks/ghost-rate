import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, session: null },
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload
      state.user = action.payload?.user ?? null
    },
    clearSession: (state) => {
      state.session = null
      state.user = null
    },
  },
})

export const { setSession, clearSession } = authSlice.actions
export default authSlice.reducer
