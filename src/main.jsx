import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./features/store.js";
import App from "./App.jsx";
import Login from "../src/components/login/Login.jsx";
import SignUp from "../src/components/signup/SignUp.jsx";
import ProfileDetails from "../src/components/profileDetails/ProfileDetails.jsx";
import PostDetails from "../src/components/postDetails/PostDetails.jsx";
import Upload from "./components/upload/Upload.jsx";
import ProfileForm from "./components/profileDetails/ProfileForm.jsx";
import ProfileBookmarks from "./components/profileDetails/ProfileBookmarks.jsx";
import MyPost from "./pages/MyPost.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/user", element: <App /> },

  // { path: "/", element: <App /> },
  // { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/profileDetails/:id", element: <ProfileDetails /> },
  { path: "/postDetails/:id", element: <PostDetails /> },
  { path: "/upload", element: <Upload /> },
  { path: "/updateprofile", element: <ProfileForm /> },
  { path: "/bookmarks/:id", element: <ProfileBookmarks /> },
  { path: "/mypost/:id", element: <MyPost /> },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
