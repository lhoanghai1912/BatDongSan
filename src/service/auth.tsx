// src/services/auth.service.ts
import apiClient from './apiClient';

export const login = async (contact: string, password: string) => {
  const res = await apiClient.post('/Account/login-with-password', {
    contact,
    password,
  });
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await apiClient.post('/Account/forgot-password', { email });
  return res.data;
};

export const register = async (contact: string) => {
  const res = await apiClient.post('Account/register-with-otp', {
    contact: contact,
  });

  return res.data;
};

export const enterOtp = async (contact: string, otp: string) => {
  const res = await apiClient.post('Account/verify-otp', {
    contact: contact,
    otp: otp,
  });
  return res.data;
};

export const create_password = async (
  verificationToken: string,
  password: string,
  confirmPassword: string,
  gender?: string,
  dateOfBirth?: Date,
  address?: string,
  avatarBase64?: string,
  taxCode?: string,
) => {
  const res = await apiClient.post('/Account/create-password', {
    verificationToken: verificationToken,
    password: password,
    confirmPassword: confirmPassword,
    gender: gender,
    dateOfBirth: dateOfBirth,
    address: address,
    avatarBase64: avatarBase64,
    taxCode: taxCode,
  });
  return res.data;
};
