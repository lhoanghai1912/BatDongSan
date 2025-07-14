// src/services/apiClient.ts
import axios from 'axios';
import store from '../store';
import Toast from 'react-native-toast-message';

const apiClient = axios.create({
  baseURL: 'https://bds.foxai.com.vn:8441/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = store.getState().user.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    // console.error('API Error:', error);
    console.log(error.message);
    if (error.response) {
      console.log('📥 Response status:', error.response.status);
      console.log('📦 Response data:', error.response.data); // 🟢 Đây là chỗ chứa lỗi như "Sai mật khẩu"
      Toast.show({
        type: 'error',
        text1: `Lỗi ${error.response.status}`,
        text2: `${error.response.data}`,
      });
    } else if (error.request) {
      console.log('📡 No response received:', error.request);
    } else {
      console.log('⚠️ Error setting up request:', error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
