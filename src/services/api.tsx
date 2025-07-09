import { getToken } from './token';

import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://your-api-url.com/api',
  timeout: 10000,
});

api.interceptors.request.use(
  async config => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);
