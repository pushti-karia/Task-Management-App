import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/notifications'); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const markAllRead = createAsyncThunk('notifications/markAllRead', async () => {
  await api.put('/notifications/read-all');
});

export const markRead = createAsyncThunk('notifications/markRead', async (id) => {
  await api.put(`/notifications/${id}/read`);
  return id;
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { notifications: [], unreadCount: 0 },
  reducers: {
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      })
      .addCase(markRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map(n =>
          n._id === action.payload ? { ...n, isRead: true } : n
        );
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
