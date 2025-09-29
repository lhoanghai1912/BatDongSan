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
export const updatePost = async (id: number, formData: FormData) => {
  try {
    console.log('form data', formData);
    const response = await apiClient.put(`/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Đặt Content-Type cho formData
        // Authorization: 'Bearer your_token_here', // Đảm bảo nếu cần, có thể để thêm token
      },
    });
    console.log('ressssssssssssssssssssssssssssssssssssssssApi', response);

    console.log('Post Updated: ', response.data);
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

    return response.data;
  } catch (error: any) {
    console.log('Error fetching all posts:', error);
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

export const getPostOfUser = async (
  page: number,
  pageSize: number,
  search?: string,
) => {
  try {
    console.log(
      `/posts/my-posts?Page=${page}&PageSize=${pageSize}&OrderBy=createdAt desc&Search=${search}`,
    );

    const response = await apiClient.get(
      `/posts/my-posts?Page=${page}&PageSize=${pageSize}&OrderBy=createdAt desc&Search=${search}`,
      {
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if needed
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.log(`Get post of User error:`, error);

    throw error;
  }
};

export const deletePost = async (id: number) => {
  try {
    const response = await apiClient.patch(`/posts/${id}/soft-delete`);

    return response.data;
  } catch (error) {
    console.log(`Delete post ${id} error:`, error);

    throw error;
  }
};
