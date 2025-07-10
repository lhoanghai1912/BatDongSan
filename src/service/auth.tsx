// src/services/auth.service.ts
import apiClient from './apiClient';

export const login = async (email: string, password: string) => {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (userData: any) => {
  const res = await apiClient.post('/auth/register', userData);
  return res.data;
};
