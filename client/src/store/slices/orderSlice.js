import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosInstance';

export const placeOrder = createAsyncThunk('orders/place', async (data, { rejectWithValue }) => {
  try { const res = await API.post('/orders', data); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try { const res = await API.get('/orders'); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const fetchOrderById = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try { const res = await API.get(`/orders/${id}`); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
  try { const res = await API.get('/orders/admin/all', { params }); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try { const res = await API.put(`/orders/${id}/status`, { status }); return res.data; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], order: null, total: 0, revenue: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (s) => { s.loading = true; })
      .addCase(placeOrder.fulfilled, (s, a) => { s.loading = false; s.order = a.payload.order; })
      .addCase(placeOrder.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMyOrders.pending, (s) => { s.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (s, a) => { s.loading = false; s.orders = a.payload.orders; })
      .addCase(fetchOrderById.fulfilled, (s, a) => { s.order = a.payload.order; })
      .addCase(fetchAllOrders.fulfilled, (s, a) => { s.orders = a.payload.orders; s.total = a.payload.total; s.revenue = a.payload.revenue; })
      .addCase(updateOrderStatus.fulfilled, (s, a) => { const idx = s.orders.findIndex(o => o._id === a.payload.order._id); if (idx > -1) s.orders[idx] = a.payload.order; });
  },
});

export default orderSlice.reducer;
