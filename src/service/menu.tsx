import { link } from '../utils/constants';
import apiClient from './apiClient';

export const login = async (contact: string, password: string) => {
  const res = await apiClient.post('/Account/login-with-password', {
    contact,
    password,
  });
  return res.data;
};

export const menu = async (lang: string) => {
  const res = await apiClient.get(`${link.url}/api/Menu`, {
    params: { lang },
  });
  return res.data;
};
