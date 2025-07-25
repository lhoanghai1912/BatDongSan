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
  taxCode?: string,
) => {
  const response = await apiClient.put('/UserProfile/profile', {
    fullName: fullName,
    phoneNumber: phoneNumber,
    address: address,
    dateOfBirth: dateOfBirth,
    gender: gender,
    taxCode: taxCode,
  });
  return response.data;
};
export const updateAvatar = async (formData: FormData) => {
  try {
    const response = await apiClient.post(
      '/UserProfile/upload-avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading avatar', error);
    throw error;
  }
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
