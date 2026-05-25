import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosInstance';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/cart'); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity }, { rejectWithValue }) => {
  try { const res = await API.post('/cart', { productId, quantity }); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try { const res = await API.put(`/cart/${itemId}`, { quantity }); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const removeCartItem = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try { const res = await API.delete(`/cart/${itemId}`); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try { await API.delete('/cart/clear'); return { cart: { items: [] } }; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (s, a) => { s.items = a.payload.cart?.items || []; })
      .addCase(addToCart.pending, (s) => { s.loading = true; })
      .addCase(addToCart.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.cart?.items || []; })
      .addCase(addToCart.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(updateCartItem.fulfilled, (s, a) => { s.items = a.payload.cart?.items || []; })
      .addCase(removeCartItem.fulfilled, (s, a) => { s.items = a.payload.cart?.items || []; })
      .addCase(clearCart.fulfilled, (s) => { s.items = []; });
  },
});

export default cartSlice.reducer;
