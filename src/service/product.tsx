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

export const getAllPosts = async (
  filterString?: string,
  orderbyString?: string,
  page?: number,
  limit?: number,
) => {
  try {
    console.log('filterString', filterString);

    const params: Record<string, any> = {};

    if (page !== undefined && page !== null) {
      params.Page = page;
    }
    if (limit !== undefined && limit !== null) {
      params.PageSize = limit;
    }

    if (filterString) {
      params.Filter = filterString;
    }
    if (orderbyString) {
      params.OrderBy = orderbyString;
    }

    const response = await apiClient.get('/posts/getall', {
      params,
      headers: {
        Accept: 'application/json',
        // Authorization: 'Bearer your_token_here',
      },
    });
    console.log('ress=====================================', response);

    return response.data;
  } catch (error: any) {
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
