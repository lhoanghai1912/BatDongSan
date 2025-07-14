// src/services/user.service.ts

import apiClient from './apiClient';
// Lấy thông tin user hiện tại
export const getCurrentUser = async () => {
  const response = await apiClient.get('/UserProfile/profile');
  return response.data;
};

// Cập nhật thông tin user theo ID
export const updateUser = async (
  fullName: string,
  phoneNumber: string,
  address: string,
  dateOfBirth?: Date,
  gender?: string,
  avatarBase64?: string,
) => {
  const response = await apiClient.put('/UserProfile/profile', {
    fullName: fullName,
    phoneNumber: phoneNumber,
    address: address,
    dateOfBirth: dateOfBirth,
    gender: gender,
    avatarBase64: avatarBase64,
  });
  return response.data;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const response = await apiClient.post('/Account/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
// Xóa user
export const deleteUserById = async (id: string) => {
  const response = await apiClient.delete(`/user/${id}`);
  return response.data;
};
