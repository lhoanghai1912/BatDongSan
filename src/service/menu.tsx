import apiClient from './apiClient';

export const login = async (contact: string, password: string) => {
  const res = await apiClient.post('/Account/login-with-password', {
    contact,
    password,
  });
  return res.data;
};

export const menu = async (lang: string) => {
  const res = await apiClient.get('https://bds.foxai.com.vn:8441/api/Menu', {
    params: { lang },
  });
  return res.data;
};
