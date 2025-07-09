import { api } from './api';
import { removeToken, saveToken } from './token';

export const AuthService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    if (response?.data?.token) {
      await saveToken(response.data.token);
    }
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    await removeToken();
    // optional: call API logout
  },
};
