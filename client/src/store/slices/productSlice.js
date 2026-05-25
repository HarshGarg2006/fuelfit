import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosInstance';

export const fetchProducts = createAsyncThunk('products/fetch', async (params, { rejectWithValue }) => {
  try { const res = await API.get('/products', { params }); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try { const res = await API.get(`/products/${id}`); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const fetchCategories = createAsyncThunk('products/categories', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/products/categories'); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const fetchAdminProducts = createAsyncThunk('products/adminFetch', async (params, { rejectWithValue }) => {
  try { const res = await API.get('/products/admin/all', { params }); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const createProduct = createAsyncThunk('products/create', async (data, { rejectWithValue }) => {
  try { const res = await API.post('/products', data); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await API.put(`/products/${id}`, data); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try { await API.delete(`/products/${id}`); return id; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const productSlice = createSlice({
  name: 'products',
  initialState: { products: [], product: null, related: [], reviews: [], categories: [], filters: {}, total: 0, pages: 0, loading: false, error: null },
  reducers: { clearProduct: (s) => { s.product = null; s.reviews = []; s.related = []; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.products = a.payload.products; s.total = a.payload.total; s.pages = a.payload.pages; s.filters = a.payload.filters || {}; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProduct.pending, (s) => { s.loading = true; })
      .addCase(fetchProduct.fulfilled, (s, a) => { s.loading = false; s.product = a.payload.product; s.reviews = a.payload.reviews; s.related = a.payload.related; })
      .addCase(fetchProduct.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload.categories; })
      .addCase(fetchAdminProducts.pending, (s) => { s.loading = true; })
      .addCase(fetchAdminProducts.fulfilled, (s, a) => { s.loading = false; s.products = a.payload.products; s.total = a.payload.total; s.pages = a.payload.pages; })
      .addCase(createProduct.fulfilled, (s, a) => { s.products.unshift(a.payload.product); })
      .addCase(updateProduct.fulfilled, (s, a) => { const idx = s.products.findIndex(p => p._id === a.payload.product._id); if (idx > -1) s.products[idx] = a.payload.product; })
      .addCase(deleteProduct.fulfilled, (s, a) => { s.products = s.products.filter(p => p._id !== a.payload); });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
