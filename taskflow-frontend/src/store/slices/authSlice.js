import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/auth/profile', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('token'), loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };
    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, rejected)
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(fetchMe.rejected, (state) => { state.token = null; localStorage.removeItem('token'); })
      .addCase(updateProfile.fulfilled, (state, action) => { state.user = action.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
