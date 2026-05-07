import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import boardReducer from './slices/boardSlice';
import taskReducer from './slices/taskSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardReducer,
    tasks: taskReducer,
    notifications: notificationReducer,
    ui: uiReducer,
  },
});
