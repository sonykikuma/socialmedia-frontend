import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { handleFollow, setBookmarkedPosts } from "../../features/authSlice";
import Header from "../navbar/Header";
import axios from "axios";
import Post from "../post/Post";
import ProfileCard from "../profileCard/ProfileCard";
import RightSide from "../rightside/RightSide";

const ProfileBookmarks = () => {
  const [profile, setProfile] = useState("");
  const [profilePosts, setProfilePosts] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const [isFollowed, setIsFollowed] = useState(false);
  //const [show, setShow] = useState("mypost");
  const dispatch = useDispatch();
  const { id } = useParams();

  const female =
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `https://backend-social3.vercel.app/user/find/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        // console.log("Fetched profile data:", data);

        setProfile(data);

        if (user?._id !== data?._id) {
          setIsFollowed(user?.followings?.includes(data?._id));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (profile?._id) {
      setProfile((prev) => ({
        ...prev,
        profileImg: profile.profileImg || female,
      }));
    }
  }, [profile]);

  // useEffect(() => {
  //   const fetchBookmarkedPosts = async () => {
  //     try {
  //       const res = await fetch(
  //         `https://backend-social3.vercel.app/user/bookmarkedPosts`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const data = await res.json();
  //       dispatch(setBookmarkedPosts(data));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchBookmarkedPosts();
  // }, [token, dispatch]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `https://backend-social3.vercel.app/post/find/userposts/${id}`
        );
        const data = await res.json();

        setProfilePosts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [id]);

  const followHandler = async () => {
    try {
      fetch(
        `https://backend-social3.vercel.app/user/toggleFollow/${profile?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "PUT",
        }
      );
      dispatch(handleFollow(id));
      setProfile((prev) => {
        return {
          ...prev,
          followers: isFollowed
            ? [...prev.followers].filter((id) => id !== user._id)
            : [...prev.followers, user._id],
        };
      });
      setIsFollowed((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className=" row mt-4  ">
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
                <div style={{ width: "70px", height: "70px" }}>
                  <img
                    src={profile?.profileImg ? profile?.profileImg : female}
                    className="border rounded-circle"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="d-flex flex-column" style={{ gap: "12px" }}>
                  <h4
                    style={{
                      textTransform: "capitalize",
                      fontSize: "26px",
                      color: "#333",
                      fontWeight: "bold",
                    }}
                  >
                    {profile?.username}
                  </h4>
                  <h4 style={{ fontWeight: "500", color: "#666" }}>
                    Bio: {profile?.desc ? profile.desc : "Live Love Laugh"}
                  </h4>
                </div>
                {profile?._id !== user._id && (
                  <button
                    onClick={followHandler}
                    className="border rounded-3"
                    style={{
                      outline: "none",
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "#1b15cf",
                      cursor: "pointer",
                      color: "#fff",
                      fontSize: "18px",
                    }}
                  >
                    {isFollowed ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
              <div
                className="d-flex justify-content-between"
                style={{ gap: "10rem", margin: "2.5rem 0" }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#333",
                  }}
                >
                  Followings: {profile?.followings?.length}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#333",
                  }}
                >
                  Followers: {profile?.followers?.length}
                </div>
              </div>

              <h2 className="text-center">Bookmarked Posts</h2>
              {console.log("bookmarked post:", profile?.bookmarkedPosts)}
              {/* {user?.bookmarkedPosts?.length > 0 ? (
                <div className="d-flex flex-column mt-4">
                  {user.bookmarkedPosts.map((post) => (
                    <div className="mb-4" key={post._id}>
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
                <h3 className="text-center">You have no bookmarked posts</h3>
              )} */}

              {/* {profile?.bookmarkedPosts?.length > 0 ? ( */}
              {profile?.bookmarkedPosts?.length > 0 ? (
                <div className="d-flex flex-column mt-4">
                  {profile?.bookmarkedPosts?.map((post) => (
                    <div className="mb-4" key={post._id}>
                      <Link
                        to={`/postDetails/${post._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <p>{post?.username}</p>
                        <p>{post?.profileImg}</p>
                        {/* <Post post={post} profileImg={profile?.profileImg} /> */}
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <h3 className="text-center">You have no bookmarked posts</h3>
              )}
            </div>{" "}
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
