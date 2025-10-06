// src/services/auth.service.ts
import apiClient from './apiClient';

export const login = async (contact: string, password: string) => {
  try {
    const res = await apiClient.post('/Account/login-with-password', {
      contact,
      password,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const loginFirebase = async (idToken: string) => {
  try {
    const res = await apiClient.post('/Account/firebase-login', { idToken });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (contact: string) => {
  try {
    const res = await apiClient.post('/Account/forgot-password-otp', {
      contact,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (contact: string) => {
  try {
    const res = await apiClient.post('Account/register-with-otp', {
      contact: contact,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
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
  try {
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
  } catch (error) {
    throw error;
  }
};

export const otp_ResetPassword = async (contact: string) => {
  try {
    const res = await apiClient.post('/Account/otp-reset-password', {
      contact,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const otp_ResetPassword_Verify = async (
  contact: string,
  otp: string,
) => {
  try {
    const res = await apiClient.post('Account/verify-otp-for-password-reset', {
      contact,
      otp,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const reset_password = async (
  contact: string,
  otp: string,
  newPassword: string,
  confirmPassword: string,
) => {
  try {
    const res = await apiClient.post('/Account/reset-password-otp', {
      contact,
      otp,
      newPassword,
      confirmPassword,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const otp_forgotPassword = async (contact: string, otp: string) => {
  try {
    const res = await apiClient.post('Account/verify-otp-for-password-reset', {
      contact,
      otp,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
