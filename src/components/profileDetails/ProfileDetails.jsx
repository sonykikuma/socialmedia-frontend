import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { handleFollow } from "../../features/authSlice";
import Header from "../navbar/Header";
import axios from "axios";
import Post from "../post/Post";

const ProfileDetails = () => {
  const [profile, setProfile] = useState("");
  const [profilePosts, setProfilePosts] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const [isFollowed, setIsFollowed] = useState(false);
  const [show, setShow] = useState("mypost");
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

  //  console.log(user?.username);
  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="d-flex flex-column align-items-center mt-3">
          <div className="d-flex align-items-center" style={{ gap: "2.5rem" }}>
            <div style={{ width: "70px", height: "70px" }}>
              <img
                src={profile?.profileImg ? profile?.profileImg : female}
                className="border rounded-circle"
                style={{ width: "70px", height: "70px", objectFit: "cover" }}
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
              style={{ fontWeight: "bold", fontSize: "18px", color: "#333" }}
            >
              Followings: {profile?.followings?.length}
            </div>
            <div
              style={{ fontWeight: "bold", fontSize: "18px", color: "#333" }}
            >
              Followers: {profile?.followers?.length}
            </div>
          </div>
          {user._id === profile?._id && (
            <div
              className="d-flex justify-content-between"
              style={{ gap: "8rem", marginBottom: "1.5rem" }}
            >
              <button
                onClick={() => setShow("mypost")}
                className={`btn text-white ${
                  show === "mypost" ? "active" : ""
                }`}
                style={{
                  backgroundColor: show === "bookmarked" ? "#666" : "blue", //999
                  padding: "0.5rem 1.25rem",
                  fontSize: "18px",
                  border: "none",
                  outline: "none",
                }}
              >
                My posts
              </button>
              <button
                onClick={() => setShow("bookmarked")}
                className={`btn text-white${
                  show === "bookmarked" ? "active" : ""
                }`}
                style={{
                  backgroundColor: show === "bookmarked" ? "blue" : "#999",
                  padding: "0.5rem 1.25rem",
                  fontSize: "18px",
                  border: "none",
                  outline: "none",
                  color: "white",
                }}
              >
                Bookmarked
              </button>
            </div>
          )}
          {show === "mypost" && profilePosts?.length > 0 ? (
            <div className="d-flex flex-column mt-4">
              {profilePosts?.map((post) => (
                <div className=" mb-4 " key={post._id}>
                  <Link
                    to={`/postDetails/${post._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Post post={post} />
                  </Link>
                </div>
              ))}
            </div>
          ) : show === "mypost" ? (
            <h2>Profile has no posts</h2>
          ) : (
            ""
          )}
          {show === "bookmarked" && profilePosts?.length > 0 ? (
            <div className="d-flex flex-column mt-4">
              {user?.bookmarkedPosts?.map((post) => (
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
          ) : show === "bookmarked" ? (
            <h2>You have no bookmarked posts</h2>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
