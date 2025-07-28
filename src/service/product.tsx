// src/services/product.service.ts
import axios from 'axios';
import apiClient from './apiClient';
import Toast from 'react-native-toast-message';
import { text } from '../utils/constants';

export const getAllImages = async () => {
  const res = await apiClient.get('/file');
  return res.data;
};

// src/service/index.ts hoặc service/postService.ts
export const createPost = async (formData: FormData) => {
  try {
    console.log('form data', formData);
    const response = await apiClient.post('/posts/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Đặt Content-Type cho formData
        // Authorization: 'Bearer your_token_here', // Đảm bảo nếu cần, có thể để thêm token
      },
    });
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

export const getPostById = async (id: number) => {
  try {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.log(`Get post ${id} error:`, error);
    return null;
  }
};

export const likePost = async (id: number) => {
  const res = await apiClient.post(`posts/${id}/like`, {
    id: id,
  });
  Toast.show({
    type: 'success',
    text1: 'Success',
    text2: 'Saved Post',
  });
  return res.data;
};

export const unlikePost = async (id: number) => {
  const res = await apiClient.delete(`posts/${id}/like`, {
    data: { id: id },
  });
  Toast.show({
    type: 'success',
    text1: 'Success',
    text2: 'UnSaved Post',
  });
  return res.data;
};

export const checkLike = async (id: number) => {
  const res = await apiClient.get(`posts/${id}/like/check`, {
    data: { id: id },
  });
  return res.data;
};

export const listLikedPost = async () => {
  const res = await apiClient.get(`posts/My_liked`);
  return res.data;
};
