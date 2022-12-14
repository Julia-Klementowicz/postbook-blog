import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import postTypes from '../types/postTypes';
import stateTypes from '../types/stateTypes';

const POSTS_URL = 'http://localhost:5000/posts';

const initialState = {
  posts: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
} as any;

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return response.data;
  } catch (error: any) {
    return error.message;
  }
});

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (newPost: postTypes) => {
    try {
      const response = await axios.post(POSTS_URL, newPost);
      return response.data;
    } catch (error: any) {
      return error.message;
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (updatedPost: postTypes) => {
    try {
      const response = await axios.put(
        `${POSTS_URL}/${updatedPost.id}`,
        updatedPost
      );
      return response.data;
    } catch (error: any) {
      return error.message;
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/detetePost',
  async (postId: string) => {
    try {
      await axios.delete(`${POSTS_URL}/${postId}`);
      return postId;
    } catch (error: any) {
      return error.message;
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    updatePostAuthor: (state, action) => {
      const postIndex = state.posts.findIndex(
        (post: postTypes) => post.id === action.payload.postId
      );
      state.posts[postIndex].user = action.payload.author;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const loadedPosts = action.payload.map((post: postTypes) => {
          return post;
        });
        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const posts = state.posts.filter(
          (post: postTypes) => post.id !== action.payload.id
        );
        state.posts = [...posts, action.payload];
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const posts = state.posts.filter(
          (post: postTypes) => post.id !== action.payload
        );
        state.posts = [...posts];
      });
  },
});

export const getAllPosts = (state: stateTypes) => state.posts.posts;
export const getPostsStatus = (state: stateTypes) => state.posts.status;

export const { updatePostAuthor } = postsSlice.actions;

const postsReducer = postsSlice.reducer;
export default postsReducer;
