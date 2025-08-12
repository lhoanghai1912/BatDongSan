import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PostType {
  _id: string;
  [key: string]: any;
}

interface PostState {
  posts: PostType[];
}

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<PostType[]>) {
      state.posts = action.payload;
    },
    addPosts(state, action: PayloadAction<PostType[]>) {
      state.posts = [...state.posts, ...action.payload];
    },
    clearPosts(state) {
      state.posts = [];
    },
  },
});

export const { setPosts, addPosts, clearPosts } = postSlice.actions;
export const postReducer = postSlice.reducer;
