import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBoards = createAsyncThunk('boards/fetchAll', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/boards'); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchBoard = createAsyncThunk('boards/fetchOne', async (id, { rejectWithValue }) => {
  try { const res = await api.get(`/boards/${id}`); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createBoard = createAsyncThunk('boards/create', async (data, { rejectWithValue }) => {
  try { const res = await api.post('/boards', data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateBoard = createAsyncThunk('boards/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await api.put(`/boards/${id}`, data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteBoard = createAsyncThunk('boards/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/boards/${id}`); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const inviteMember = createAsyncThunk('boards/invite', async ({ id, email, role }, { rejectWithValue }) => {
  try { const res = await api.post(`/boards/${id}/invite`, { email, role }); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const boardSlice = createSlice({
  name: 'boards',
  initialState: { boards: [], currentBoard: null, loading: false, error: null },
  reducers: {
    setCurrentBoard(state, action) { state.currentBoard = action.payload; },
    clearCurrentBoard(state) { state.currentBoard = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => { state.loading = true; })
      .addCase(fetchBoards.fulfilled, (state, action) => { state.loading = false; state.boards = action.payload; })
      .addCase(fetchBoards.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchBoard.fulfilled, (state, action) => { state.currentBoard = action.payload; })
      .addCase(createBoard.fulfilled, (state, action) => { state.boards.unshift(action.payload); })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.boards = state.boards.map(b => b._id === action.payload._id ? action.payload : b);
        if (state.currentBoard?._id === action.payload._id) state.currentBoard = action.payload;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter(b => b._id !== action.payload);
      })
      .addCase(inviteMember.fulfilled, (state, action) => {
        if (state.currentBoard?._id === action.payload._id) state.currentBoard = action.payload;
      });
  },
});

export const { setCurrentBoard, clearCurrentBoard } = boardSlice.actions;
export default boardSlice.reducer;
