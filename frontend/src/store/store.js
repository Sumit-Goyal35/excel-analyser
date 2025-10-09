import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import excelReducer from './excelSlice';
import userReducer from './userSlice';
import aiReducer from './aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    excel: excelReducer,
    user: userReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
