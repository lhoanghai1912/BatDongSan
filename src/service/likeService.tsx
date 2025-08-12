import apiClient from './apiClient';

export const likePost = async (id: number, isLiked: boolean) => {
  const res = await apiClient.post(`posts/${id}/toggle-like`, {
    isLiked,
  });
  console.log(res);

  return res.data;
};

// export const unlikePost = async (id: number) => {
//   const res = await apiClient.delete(`posts/${id}/like`, {
//     data: { id: id },
//   });

//   return res.data;
// };

// export const checkLike = async (id: number) => {
//   const res = await apiClient.get(`posts/${id}/like/check`, {
//     data: { id: id },
//   });
//   return res.data;
// };

export const listLikedPost = async () => {
  const res = await apiClient.get(`posts/My_liked`);
  return res.data;
};
