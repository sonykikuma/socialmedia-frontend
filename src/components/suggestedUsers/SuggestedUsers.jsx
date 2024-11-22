import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../util/capitalizeFirstLetter";
import { Link } from "react-router-dom";
import { handleFollow } from "../../features/authSlice";

const SuggestedUsers = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [usercount, setUsercount] = useState(5);
  const dispatch = useDispatch();

  const female =
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200";

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await fetch(
          `https://backend-social3.vercel.app/user/find/suggestedUsers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        // console.log(data);
        setSuggestedUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, []);

  const toggleFollow = async (id) => {
    try {
      await fetch(
        `https://backend-social3.vercel.app/user/toggleFollow/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "PUT",
        }
      );
      // setSuggestedUsers((prev) => {
      //   return [...prev].filter((user) => user._id !== id);
      // });
      dispatch(handleFollow(id));
    } catch (err) {
      console.log(err);
    }
  };

  const showmoreHandler = () => {
    setUsercount((prev) => prev + 2);
  };

  return (
    <div className="container-fluid  mt-4">
      <div className="">
        {suggestedUsers?.length > 0 ? (
          <div className=" mt-4 px-2 ">
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
            <div className="overflow-auto" style={{ maxWidth: "100%" }}>
              <div className="d-flex flex-column">
                {suggestedUsers?.slice(0, usercount).map((suggestedUser) => (
                  <div
                    className="d-flex justify-content-between align-items-center"
                    key={suggestedUser._id}
                  >
                    <div
                      className="d-flex align-items-center mb-4 "
                      style={{ gap: "8px" }}
                    >
                      <Link to={`/profileDetails/${suggestedUser._id}`}>
                        <img
                          style={{
                            height: "50px",
                            width: "50px",
                            objectFit: "cover",
                          }}
                          src={
                            suggestedUser?.profileImg
                              ? suggestedUser?.profileImg
                              : female
                          }
                          alt=""
                          className="border rounded-circle"
                        />
                      </Link>
                      <div className="d-flex flex-column">
                        <span style={{ fontSize: "20px", fontWeight: "600" }}>
                          {capitalizeFirstLetter(suggestedUser.username)}
                        </span>
                      </div>{" "}
                    </div>

                    <button
                      onClick={() => toggleFollow(suggestedUser._id)}
                      className="text-primary"
                    >
                      {user.followings.includes(suggestedUser._id)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <h3
            style={{
              marginTop: "1.5rem",
              whiteSpace: "nowrap",
              fontSize: "22px",
            }}
          >
            You have no suggested users
          </h3>
        )}
      </div>
    </div>
  );
};

export default SuggestedUsers;
