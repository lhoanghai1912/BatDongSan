// src/services/product.service.ts
import apiClient from './apiClient';

export const getAllImages = async () => {
  const res = await apiClient.get('/file');
  return res.data;
};

export const getAllPosts = async () => {
  const res = await apiClient.get('/property-post');
  return res.data;
};
