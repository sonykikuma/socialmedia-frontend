import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/navbar/Header";
import Post from "../components/post/Post";
import { Link, useParams } from "react-router-dom";
import ProfileCard from "../components/profileCard/ProfileCard";
import RightSide from "../components/rightside/RightSide";

const MyPost = () => {
  const { id } = useParams(); // Assuming `id` is coming from the URL params

  const { user, token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [profilePosts, setProfilePosts] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const dispatch = useDispatch();

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

        // Determine if the logged-in user is following the profile user
        if (user?._id !== data?._id) {
          setIsFollowed(user?.followings?.includes(data?._id));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (id) fetchProfile();
  }, [id, token, user]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `https://backend-social3.vercel.app/post/find/userposts/${id}`
        );
        const data = await res.json();
        setProfilePosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (id) fetchPosts();
  }, [id]);

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
                <img
                  src={profile?.profileImg || female}
                  className="border rounded-circle"
                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  alt="Profile"
                />
                <div>
                  <h4 className="text-capitalize" style={{ fontSize: "26px" }}>
                    {profile?.username}
                  </h4>
                  <h4 style={{ fontWeight: "500" }}>
                    Bio: {profile?.desc || "Live Love Laugh"}
                  </h4>
                </div>
              </div>
              <div
                className="d-flex justify-content-between"
                style={{ gap: "10rem", margin: "2.5rem 0" }}
              >
                <div>Followings: {profile?.followings?.length || 0}</div>
                <div>Followers: {profile?.followers?.length || 0}</div>
              </div>
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
          <RightSide />
        </div>
      </div>
    </>
  );
};

export default MyPost;
