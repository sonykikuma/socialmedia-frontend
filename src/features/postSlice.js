import { createSlice } from "@reduxjs/toolkit";

// export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, updatedDesc }) => {
//   const response = await fetch(`/api/posts/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify({ desc: updatedDesc }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await response.json();
//   return data;  // Ensure it returns the updated post
// });

export const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    },
    addPost(state, action) {
      state.posts.push(action.payload);
    },
    updatePost(state, action) {
      const { id, updatedDesc } = action.payload;
      const postIndex = state.findIndex((post) => post._id === id);
      if (postIndex !== -1) {
        state[postIndex].desc = updatedDesc; // Update the post description
      }

      // const { postId, updatedPost } = action.payload;

      // const postIndex = state.posts.findIndex((post) => post._id === postId);
      // if (postIndex !== -1) {
      //   state.posts[postIndex] = {
      //     ...state.posts[postIndex],
      //     ...updatedPost,
      //   };
      // }
    },
    deletePost(state, action) {
      const postId = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postId);
    },
  },
});

export const { setPosts, addPost, updatePost, deletePost } = postSlice.actions;
export default postSlice.reducer;

// const { cloudinary } = require("cloudinary");
// const crypto = require("crypto");

// const cloudinaryConfig = () => {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });
// };

// const generateSignature = (paramsToSign) => {
//   const { api_secret } = cloudinary.config();
//   const sortedParams = Object.keys(paramsToSign)
//     .sort()
//     .map((key) => `${key}=${paramsToSign[key]}`)
//     .join("&");

//   const signature = crypto
//     .createHash("sha1")
//     .update(sortedParams + api_secret)
//     .digest("hex");

//   return signature;
// };

// const uploadToCloudinary = async (filePath) => {
//   try {
//     cloudinaryConfig();
//     const timestamp = Math.round(new Date().getTime() / 1000);
//     const paramsToSign = {
//       timestamp,
//     };

//     const signature = generateSignature(paramsToSign);
//     const result = await cloudinary.uploader.upload(filePath, {
//       ...paramsToSign,
//       signature,
//       api_key: process.env.CLOUDINARY_API_KEY,
//     });
//     return result;
//   } catch (error) {
//     console.error(error);
//   }
// };

// module.exports = uploadToCloudinary;
