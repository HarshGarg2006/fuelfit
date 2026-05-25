import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosInstance';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/wishlist'); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const toggleWishlistItem = createAsyncThunk('wishlist/toggle', async (productId, { rejectWithValue }) => {
  try { const res = await API.post(`/wishlist/${productId}`); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { products: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (s, a) => { s.products = a.payload.wishlist?.products || []; })
      .addCase(toggleWishlistItem.fulfilled, (s, a) => { s.products = a.payload.wishlist?.products || []; });
  },
});

export default wishlistSlice.reducer;
