// src/services/user.service.ts

import apiClient from './apiClient';

// Lấy thông tin user hiện tại
export const getCurrentUser = async () => {
  const response = await apiClient.get('/user/me');
  return response.data;
};

// Lấy danh sách tất cả user
export const getAllUsers = async () => {
  const response = await apiClient.get('/user');
  return response.data;
};

// Cập nhật thông tin user theo ID
export const updateUserById = async (id: string, data: any) => {
  const response = await apiClient.put(`/user/${id}`, data);
  return response.data;
};

// Xóa user
export const deleteUserById = async (id: string) => {
  const response = await apiClient.delete(`/user/${id}`);
  return response.data;
};
