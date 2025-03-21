import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//for bookmarked page posts-unbookmarking from page
export const updateBookmarks = (postId) => (dispatch, getState) => {
  const { user } = getState().auth;
  const updatedBookmarks = user.bookmarkedPosts.filter(
    (bookmark) => bookmark._id !== postId
  );

  dispatch({
    type: "auth/updateBookmarks",
    payload: { ...user, bookmarkedPosts: updatedBookmarks },
  });
};

const initialState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  // profile: null,
  // profilePosts: [],
  // isFollowed: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      localStorage.clear();
      state.user = action.payload.others;
      state.token = action.payload.token;
    },
    register(state, action) {
      localStorage.clear();
      //state.user = action.payload.user;
      state.user = action.payload.others;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
    handleFollow(state, action) {
      if (state.user.followings.includes(action.payload)) {
        state.user.followings = state.user.followings.filter(
          (id) => id !== action.payload
        );
      } else {
        console.log(action.payload);
        state.user.followings.push(action.payload);
      }
    },
    // bookmarkPost(state, action) {
    //   if (
    //     state.user.bookmarkedPosts.some(
    //       (post) => post._id === action.payload._id
    //     )
    //   ) {
    //     state.user.bookmarkedPosts = state.user.bookmarkedPosts.filter(
    //       (post) => post._id !== action.payload._id
    //     );
    //   } else {
    //     state.user.bookmarkedPosts.push(action.payload);
    //   }
    // },
    updateUser(state, action) {
      state.user = action.payload;
    },
    updateBookmarks: (state, action) => {
      state.user = action.payload;
    },
    bookmarkPost(state, action) {
      const postId = action.payload._id;
      const existingIndex = state.user.bookmarkedPosts.findIndex(
        (post) => post._id === postId
      );

      if (existingIndex !== -1) {
        // Remove the post if it's already bookmarked
        state.user.bookmarkedPosts.splice(existingIndex, 1);
      } else {
        // Add the post if it's not bookmarked
        state.user.bookmarkedPosts.push(action.payload);
      }
    },

    // setBookmarkedPosts(state, action) {
    //   state.user.bookmarkedPosts = action.payload;
    // },
  },
});

export const {
  login,
  register,
  logout,
  handleFollow,
  bookmarkPost,
  updateUser,
} = authSlice.actions;
export default authSlice.reducer;
