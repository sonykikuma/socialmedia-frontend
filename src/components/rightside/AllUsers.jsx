import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "../../util/capitalizeFirstLetter";
import { handleFollow } from "../../features/authSlice";

const AllUsers = ({ onFollowChange }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [friends, setFriends] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [usercount, setUsercount] = useState(5);
  const [search, setSearch] = useState("");

  const defaultProfileImg =
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200";

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Fetch friends
        const friendsRes = await fetch(
          "https://backend-social3.vercel.app/user/find/friends",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const friendsData = await friendsRes.json();
        setFriends(friendsData);

        // Fetch suggested users
        const suggestedRes = await fetch(
          "https://backend-social3.vercel.app/user/find/suggestedUsers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const suggestedData = await suggestedRes.json();
        setSuggestedUsers(suggestedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const toggleFollow = async (id) => {
    try {
      await fetch(
        `https://backend-social3.vercel.app/user/toggleFollow/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "PUT",
        }
      );
      dispatch(handleFollow(id));
      onFollowChange();
    } catch (err) {
      console.log(err);
    }
  };

  const showmoreHandler = () => {
    setUsercount((prev) => prev + 2);
  };

  const combinedUsers = [...friends, ...suggestedUsers];

  const searchedUser = combinedUsers.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <input
        type="text"
        placeholder="Search users..."
        className="form-control px-2 mb-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        //  style={{ marginLeft: "1rem" }}
      />

      <div className="d-flex align-items-center justify-content-between  pt-2 ">
        <span className="fw-bold fs-100">
          {" "}
          <strong>Who to follow?</strong>
        </span>{" "}
        <span
          onClick={showmoreHandler}
          style={{ cursor: "pointer", color: "#ff4c4c" }}
        >
          <strong className="text-primary">show more</strong>
        </span>
      </div>
      <hr />
      {searchedUser.slice(0, usercount).map((userItem) => (
        <div
          key={userItem._id}
          className="d-flex justify-content-between align-items-center mb-4"
        >
          <Link
            to={`/profileDetails/${userItem._id}`}
            className="d-flex align-items-center"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              src={userItem.profileImg || defaultProfileImg}
              alt={userItem.username}
              className="border rounded-circle"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <div className="ms-2">
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                {capitalizeFirstLetter(userItem.username)}
              </span>
            </div>
          </Link>
          <button
            onClick={() => toggleFollow(userItem._id)}
            className="btn btn-outline-primary"
          >
            {user.followings.includes(userItem._id) ? "Unfollow" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AllUsers;
