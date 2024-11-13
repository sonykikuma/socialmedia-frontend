import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchProfileById, handleFollow } from "../features/authSlice";
import Header from "../components/navbar/Header";
import Post from "../components/post/Post";

const MyPost = () => {
  // const { id } = useParams();

  // const { user, profile, profilePosts, isFollowed } = useSelector(
  //   (state) => state.auth
  // );
  // const { token } = useSelector((state) => state.auth);
  // const [show, setShow] = useState("mypost");
  // console.log("ID from URL:", user?.id);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log("Token from state:", token);

  //   if (id && token) {
  //     dispatch(fetchProfileById(id));
  //   }
  //   // You may also want to fetch posts or use cached data if available
  // }, [id, dispatch, token]);

  // const followHandler = () => {
  //   dispatch(handleFollow(profile?._id));
  // };
  const { user, profile, profilePosts } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id && token) {
      dispatch(fetchProfileById(user.id));
    }
  }, [user?.id, dispatch, token]);

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="d-flex flex-column align-items-center mt-3">
          {/* Profile and follow button */}
          <div className="d-flex align-items-center" style={{ gap: "2.5rem" }}>
            <img
              src={profile?.profileImg}
              className="border rounded-circle"
              style={{ width: "70px", height: "70px", objectFit: "cover" }}
              alt="Profile"
            />
            <div className="d-flex flex-column" style={{ gap: "12px" }}>
              <h4
                className="text-capitalize"
                style={{ fontSize: "26px", color: "#333" }}
              >
                {profile?.username}
              </h4>
              <h4 style={{ fontWeight: "500", color: "#666" }}>
                Bio: {profile?.desc || "Live Love Laugh"}
              </h4>
            </div>
          </div>

          {/* Followings and Followers */}
          <div
            className="d-flex justify-content-between"
            style={{ gap: "10rem", margin: "2.5rem 0" }}
          >
            <div>Followings: {profile?.followings?.length}</div>
            <div>Followers: {profile?.followers?.length}</div>
          </div>

          {/* Render All Posts */}
          {profilePosts?.length ? (
            <div className="d-flex flex-column mt-4">
              {profilePosts.map((post) => (
                <div key={post._id} className="mb-4">
                  <Link
                    to={`/postDetails/${post._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Post post={post} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <h2>No posts available</h2>
          )}
        </div>
      </div>
    </>
  );
};

export default MyPost;
