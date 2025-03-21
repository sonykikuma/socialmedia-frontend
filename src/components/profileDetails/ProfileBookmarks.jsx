import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  handleFollow,
  bookmarkPost,
  updateBookmarks,
} from "../../features/authSlice";
import { format } from "timeago.js";
import Header from "../navbar/Header";
import RightSide from "../rightside/RightSide";
import ProfileCard from "../profileCard/ProfileCard";

const ProfileBookmarks = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState("");
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  //const [isFollowed, setIsFollowed] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPostsState, setBookmarkedPostsState] = useState({}); // To handle UI updates on bookmark

  const female =
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200";

  useEffect(() => {
    // fetching user profile and compare user id with the id of user in a bookmarked post
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `https://backend-social3.vercel.app/user/find/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [user, token]);

  useEffect(() => {
    // Fetching the bookmarked posts of the user
    const fetchBookmarkedPosts = async () => {
      try {
        const res = await fetch(
          `https://backend-social3.vercel.app/user/bookmarkedPosts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setBookmarkedPosts(data);

        // Fetching the profile data (images and usernames) for each bookmarked post's user
        const fetchProfileData = async () => {
          const profiles = {};
          for (const post of data) {
            try {
              const res = await fetch(
                `https://backend-social3.vercel.app/user/find/${post.user}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const userData = await res.json();
              profiles[post._id] = {
                profileImg: userData.profileImg || female,
                //"defaultProfileImage.jpg",
                username: userData.username || "Unknown User",
              };
            } catch (error) {
              console.error("Error fetching user profile data:", error);
            }
          }
          setProfileData(profiles);
        };
        fetchProfileData();
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookmarkedPosts();
  }, [token]);

  const handleLikePost = async (postId) => {
    try {
      await fetch(
        `https://backend-social3.vercel.app/post/toggleLike/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "PUT",
        }
      );
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="row ">
          <div className="col-md-3 container ">
            <ProfileCard />
            <div className="d-flex align-items-center justify-content-center">
              <Link to="/upload" className="btn btn-primary my-4  ">
                Create a Post
              </Link>
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-flex flex-column align-items-center mt-3">
              <div
                className="d-flex align-items-center"
                style={{ gap: "2.5rem" }}
              >
                <img
                  src={user?.profileImg || female}
                  className="border rounded-circle"
                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  alt="Profile"
                />
                <div>
                  <h4 className="text-capitalize" style={{ fontSize: "26px" }}>
                    {user?.username}
                  </h4>
                  <h4 style={{ fontWeight: "500" }}>
                    Bio: {user?.bio || "Live Love Laugh"}
                  </h4>
                </div>
              </div>
              <div
                className="d-flex justify-content-between"
                style={{ gap: "10rem", margin: "2.5rem 0" }}
              >
                <div>Followings: {user?.followings?.length || 0}</div>
                <div>Followers: {user?.followers?.length || 0}</div>
              </div>
              {/* bookmarked post */}
              <h2 className="text-center">Bookmarked Posts</h2>
              {bookmarkedPosts.length > 0 ? (
                <div
                  className="d-flex align-items-center justify-content-center mb-4"
                  style={{ gap: "20px" }}
                >
                  <div className="d-flex flex-column mt-4">
                    {bookmarkedPosts?.map((post) => {
                      const isLiked = post?.likes?.includes(user._id); // Check if user liked this post
                      const isBookmarked = user?.bookmarkedPosts?.some(
                        (bookmarkedPost) => bookmarkedPost._id === post._id
                      );

                      return (
                        <>
                          <div
                            key={post._id}
                            className="rounded border pb-1 overflow-hidden shadow mb-4"
                            style={{ width: "400px" }}
                          >
                            <div
                              className="d-flex  align-items-center"
                              style={{
                                paddingBottom: "1rem",
                                marginTop: "8px",
                                borderBottom: "1px solid #333",
                                paddingLeft: "12px",
                                paddingRight: "12px",
                              }}
                            >
                              {" "}
                              <Link
                                to={`/postDetails/${post._id}`}
                                style={{ textDecoration: "none" }}
                              >
                                <img
                                  src={
                                    profileData[post._id]?.profileImg || female
                                    //"defaultProfileImage.jpg"
                                  }
                                  // src={
                                  //   profileImages[post._id] ||
                                  //   "defaultProfileImage.jpg"
                                  // } // Fallback image if none is found
                                  alt=""
                                  className="border rounded-circle"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                  }}
                                />
                              </Link>
                              {/* {console.log(profileData[post._id]?.profileImg)} */}
                              <div className="d-flex flex-column ms-2">
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {/* {post?.user?.username} */}
                                  {profileData[post._id]?.username ||
                                    "Unknown User"}
                                </span>
                                <span
                                  style={{ fontSize: "15px", color: "#555" }}
                                >
                                  {format(post.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "18px",
                                  color: "#333",
                                  padding: "1rem",
                                }}
                              >
                                {post.desc}
                              </div>
                              {post?.location && (
                                <div style={{ color: "#333", padding: "1rem" }}>
                                  Location: {post.location}
                                </div>
                              )}

                              <img
                                style={{
                                  height: "400px",
                                  width: "100%",
                                  objectFit: "cover",
                                }}
                                src={
                                  post?.photo
                                    ? post?.photo
                                    : "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                }
                                alt="post"
                              />
                            </div>
                            {/* Like and Bookmark  */}
                            {/* <div className="d-flex justify-content-around py-2 border-top">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleLikePost(post._id)}
                              >
                                {isLiked ? "Unlike" : "Like"}
                              </button>
                              <button
                                onClick={() => toggleBookmark(post._id)}
                                className="btn btn-outline-danger"
                              >
                                {bookmarkedPosts.some((p) => p._id === post._id)
                                  ? "Remove Bookmark"
                                  : "Bookmark"}
                              </button>
                            </div> */}
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <h3 className="text-center">You have no bookmarked posts</h3>
              )}{" "}
            </div>
          </div>
          <div className="col-md-3">
            <RightSide />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileBookmarks;

{
  /* <div className="d-flex justify-content-around py-2 border-top">
                            <button
                              className="btn btn-outline-primary"
                              // onClick={() => handleLikePost(post._id)}
                            >
                              {/*  {post.isLiked ? "Unlike" : "Like"} 
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleBookmark(post._id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-bookmark-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                              </svg>
                            </button>
                          </div> */
}
//
