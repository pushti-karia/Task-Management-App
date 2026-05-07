import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('darkMode') === 'true',
    sidebarOpen: true,
    taskModalOpen: false,
    createBoardModalOpen: false,
    createTaskModalOpen: false,
  },
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    openTaskModal(state) { state.taskModalOpen = true; },
    closeTaskModal(state) { state.taskModalOpen = false; },
    openCreateBoardModal(state) { state.createBoardModalOpen = true; },
    closeCreateBoardModal(state) { state.createBoardModalOpen = false; },
    openCreateTaskModal(state) { state.createTaskModalOpen = true; },
    closeCreateTaskModal(state) { state.createTaskModalOpen = false; },
  },
});

export const {
  toggleDarkMode, toggleSidebar,
  openTaskModal, closeTaskModal,
  openCreateBoardModal, closeCreateBoardModal,
  openCreateTaskModal, closeCreateTaskModal,
} = uiSlice.actions;
export default uiSlice.reducer;
