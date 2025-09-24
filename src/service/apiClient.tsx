// src/services/apiClient.ts
import axios from 'axios';
import store from '../store';
import Toast from 'react-native-toast-message';
import { link } from '../utils/constants';

const apiClient = axios.create({
  baseURL: `${link.url}/api`,
  timeout: 10000,
  headers: {
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
  response => {
    // Kiểm tra status code - nếu khác 200 thì vào error
    if (response.status !== 200) {
      const status = response.status;
      const data = response.data;
      const message = data.message.value;
      console.log('response', response);

      console.log('📥 Non-200 status:', status);
      console.log('📦 Response data:', data);

      // Tạo error object để reject
      const error = new Error(message);
      (error as any).response = response;
      (error as any).status = status;
      return Promise.reject(error);
    }

    // Nếu response trả về message "Bạn đã ứng tuyển job này rồi" mà status vẫn là 200

    return response;
  },
  error => {
    console.log('API Error:', error.message);
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const message = data.message.value;
      const value = data.value; // Giả sử server trả về lỗi trong trường 'value'

      console.log('📥 Response status:', status);
      console.log('📦 Response data:', data);

      Toast.show({
        type: 'error',
        text2: message || 'Đã có lỗi xảy ra',
      });
    }
    return Promise.reject(error);
  },
);
export default apiClient;
