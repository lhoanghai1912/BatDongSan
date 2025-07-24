// src/services/product.service.ts
import axios from 'axios';
import apiClient from './apiClient';

export const getAllImages = async () => {
  const res = await apiClient.get('/file');
  return res.data;
};

// src/service/index.ts hoặc service/postService.ts
export const createPost = async (formData: FormData) => {
  try {
    console.log('form data', formData);
    const response = await apiClient.post('/posts/create', formData);

    console.log('ressssssssssssssssssssssssssssssssssssssssApi', response);

    console.log('Post Created: ', response.data);
    return response;
  } catch (error) {
    console.log('API error', error);
    throw error;
  }
};

export const getAllPosts = async (filterString = '', page = 1, limit = 10) => {
  try {
    const params: any = {
      page,
      limit,
    };

    if (filterString) {
      params.Filter = filterString;
    }

    const response = await apiClient.get('/posts/getall', {
      params,
      headers: {
        Accept: 'application/json',
        // Authorization: 'Bearer your_token_here',
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
    throw error;
  }
};
