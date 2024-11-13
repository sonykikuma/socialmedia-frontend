import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  profile: null,
  profilePosts: [],
  isFollowed: false,
};

export const fetchProfileById = createAsyncThunk(
  "auth/fetchProfileById",
  async (id, { rejectWithValue, getState }) => {
    try {
      console.log("Fetching profile for ID:", id);
      if (!id) throw new Error("Invalid user ID");
      const token = getState().auth.token;

      const response = await axios.get(
        `https://backend-social3.vercel.app/user/find/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
    bookmarkPost(state, action) {
      if (
        state.user.bookmarkedPosts.some(
          (post) => post._id === action.payload._id
        )
      ) {
        state.user.bookmarkedPosts = state.user.bookmarkedPosts.filter(
          (post) => post._id !== action.payload._id
        );
      } else {
        state.user.bookmarkedPosts.push(action.payload);
      }
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
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
