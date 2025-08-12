// app/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/userSlice'; // Import reducer chính
import { loadingReducer } from './reducers/loadingSlice';
import { postReducer } from './reducers/postSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
    post: postReducer,
  }, // Cấu hình reducer chính
});

export type RootState = ReturnType<typeof store.getState>; // Lấy kiểu state từ store
export type AppDispatch = typeof store.dispatch; // Lấy kiểu dispatch từ store

export default store;
