import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosInstance';

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/login', data);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    if (res.data.token) localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed'); }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/register', data);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    if (res.data.token) localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await API.post('/auth/logout'); } catch {}
  localStorage.removeItem('user');
  localStorage.removeItem('token');
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/auth/me'); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try { const res = await API.post('/auth/forgot-password', { email }); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }, { rejectWithValue }) => {
  try { const res = await API.put(`/auth/reset-password/${token}`, { password }); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try { const res = await API.put('/auth/profile', data); localStorage.setItem('user', JSON.stringify(res.data.user)); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addAddress = createAsyncThunk('auth/addAddress', async (data, { rejectWithValue }) => {
  try { const res = await API.post('/auth/address', data); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteAddress = createAsyncThunk('auth/deleteAddress', async (id, { rejectWithValue }) => {
  try { const res = await API.delete(`/auth/address/${id}`); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const storedUser = localStorage.getItem('user');
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: storedUser ? JSON.parse(storedUser) : null, loading: false, error: null, message: null },
  reducers: { clearError: (state) => { state.error = null; }, clearMessage: (state) => { state.message = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(logoutUser.fulfilled, (s) => { s.user = null; })
      .addCase(getMe.fulfilled, (s, a) => { s.user = a.payload.user; })
      .addCase(forgotPassword.pending, (s) => { s.loading = true; })
      .addCase(forgotPassword.fulfilled, (s, a) => { s.loading = false; s.message = a.payload.message; })
      .addCase(forgotPassword.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload.user; })
      .addCase(addAddress.fulfilled, (s, a) => { if (s.user) s.user.addresses = a.payload.addresses; })
      .addCase(deleteAddress.fulfilled, (s, a) => { if (s.user) s.user.addresses = a.payload.addresses; });
  },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
