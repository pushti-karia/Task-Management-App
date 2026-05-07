import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBoardTasks = createAsyncThunk('tasks/fetchBoard', async ({ boardId, filters }, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams(filters || {}).toString();
    const res = await api.get(`/tasks/board/${boardId}?${params}`);
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createTask = createAsyncThunk('tasks/create', async (data, { rejectWithValue }) => {
  try { const res = await api.post('/tasks', data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await api.put(`/tasks/${id}`, data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/tasks/${id}`); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const reorderTasks = createAsyncThunk('tasks/reorder', async (tasks, { rejectWithValue }) => {
  try { await api.put('/tasks/reorder', { tasks }); return tasks; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: [], selectedTask: null, loading: false, error: null },
  reducers: {
    setSelectedTask(state, action) { state.selectedTask = action.payload; },
    clearSelectedTask(state) { state.selectedTask = null; },
    // Real-time socket updates
    socketTaskCreated(state, action) { state.tasks.push(action.payload); },
    socketTaskUpdated(state, action) {
      state.tasks = state.tasks.map(t => t._id === action.payload._id ? action.payload : t);
    },
    socketTaskDeleted(state, action) {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
    },
    socketTaskMoved(state, action) {
      const { taskId, column, order } = action.payload;
      state.tasks = state.tasks.map(t => t._id === taskId ? { ...t, column, order } : t);
    },
    optimisticMove(state, action) {
      const { taskId, column, order } = action.payload;
      state.tasks = state.tasks.map(t => t._id === taskId ? { ...t, column, order } : t);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchBoardTasks.fulfilled, (state, action) => { state.loading = false; state.tasks = action.payload; })
      .addCase(fetchBoardTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTask.fulfilled, (state, action) => { state.tasks.push(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map(t => t._id === action.payload._id ? action.payload : t);
        if (state.selectedTask?._id === action.payload._id) state.selectedTask = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
        if (state.selectedTask?._id === action.payload) state.selectedTask = null;
      });
  },
});

export const { setSelectedTask, clearSelectedTask, socketTaskCreated, socketTaskUpdated, socketTaskDeleted, socketTaskMoved, optimisticMove } = taskSlice.actions;
export default taskSlice.reducer;
