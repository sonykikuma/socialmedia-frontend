import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "../../util/capitalizeFirstLetter";
import SuggestedUsers from "../suggestedUsers/SuggestedUsers";

const RightSide = () => {
  const [friends, setFriends] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const female =
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200";

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://backend-social3.vercel.app/user/find/friends`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setFriends(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [user?.followings]);

  if (loading) {
    return <p>loading friends.....</p>;
  }
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="container col-md-3 ">
        <div className="d-flex flex-column pb-2 align-items-center">
          {friends?.length > 0 ? (
            friends?.map((friend) => (
              <Link
                className="d-flex align-items-center mb-4"
                key={friend?._id}
                to={`/profileDetails/${friend?._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={friend?.profileImg ? friend?.profileImg : female}
                  alt=""
                  className="border rounded-circle"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                  }}
                />
                <div className="ms-2">
                  <span style={{ fontSize: "18px", fontWeight: "500" }}>
                    {capitalizeFirstLetter(friend?.username)}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <span>You have no friends, follow someone!</span>
          )}
        </div>
        <SuggestedUsers />
      </div>
    </>
  );
};

export default RightSide;
