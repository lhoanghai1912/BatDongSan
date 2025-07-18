// src/services/product.service.ts
import axios from 'axios';
import apiClient from './apiClient';

export const getAllImages = async () => {
  const res = await apiClient.get('/file');
  return res.data;
};

export const getAllPosts = async () => {
  try {
    const response = await apiClient.get('/posts/getall', {
      params: {
        page: 1,
        limit: 10,
      },
      headers: {
        Accept: 'application/json',
        // Authorization: 'Bearer your_token_here', // nếu API cần token
      },
    });
    console.log('Property Posts:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};
