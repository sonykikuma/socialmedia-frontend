import React from "react";
import { capitalizeFirstLetter } from "../../util/capitalizeFirstLetter";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "timeago.js";

const ProfileCard = () => {
  const { user } = useSelector((state) => state.auth);
  const female =
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200";
  return (
    <>
      <div
        className="overflow-x-auto container-fluid border rounded-4 d-flex flex-column justify-content-center align-items-center"
        style={{ backgroundColor: "#f4f4f4" }}
      >
        <div
          style={{
            paddingTop: "4px",
            paddingBottom: "4px",
            paddingLeft: "6px",
            paddingRight: "6px",
          }}
        >
          <div className="">
            <div className="d-flex align-items-center justify-content-center">
              <img
                //src={female}
                src={user?.profileImg ? user?.profileImg : female}
                alt=""
                className="border rounded-circle"
                style={{ height: "45px", width: "45px", objectFit: "cover" }}
              />
            </div>
            <div
              className="d-flex flex-column align-items-center"
              style={{ marginTop: "15px" }}
            >
              <p>
                <span style={{ fontSize: "17px", fontWeight: "500" }}>
                  Username:
                </span>
                {/* {capitalizeFirstLetter(user?.username)} */}
                {user?.username}
              </p>
              <p>
                <span style={{ fontSize: "17px", fontWeight: "500" }}>
                  Created At:
                </span>{" "}
                {format(user?.createdAt)}
              </p>
            </div>
          </div>
          <hr />
          <div className="d-flex align-items-center justify-content-between">
            <p>
              Followers:<span>{user?.followers.length}</span>
            </p>
            <p className="ms-1">
              Followings:<span>{user?.followings.length}</span>
            </p>{" "}
          </div>
        </div>

        <Link
          to={`/profileDetails/${user?._id}`}
          //to={`/mypost/${user?.id}`}
          style={{ textDecoration: "none" }}
        >
          <h3
            className=""
            style={{
              textDecoration: "none",
              color: "#0e5ad4",
              fontSize: "20px",
              marginBottom: "12px",
              cursor: "pointer",
            }}
          >
            My Profile
          </h3>
        </Link>
        <Link to={`/bookmarks/${user?._id}`} style={{ textDecoration: "none" }}>
          Bookmarks
        </Link>
        <Link to={`/mypost/${user?._id}`} style={{ textDecoration: "none" }}>
          myposts
        </Link>
      </div>
      <div className=" mt-4">
        <div
          className="d-flex align-items-center justify-content-center flex-wrap"
          style={{ gap: "6px" }}
        >
          <img
            src={user?.profileImg ? user?.profileImg : female}
            alt=""
            className="border rounded-circle"
            style={{ objectFit: "cover", height: "50px", width: "50px" }}
          />
          <div
            className="d-flex flex-column"
            style={{
              gap: "3px",
              borderLeft: "1px solid #333",
              paddingLeft: "8px",
            }}
          >
            <span style={{ fontSize: "20px", fontWeight: "500" }}>
              {user?.username}
              {/* {user?.username ? capitalizeFirstLetter(user?.username) : ""} */}
            </span>
            <span className="" style={{ fontSize: "15px", color: "#555" }}>
              {user?.bio ? user.bio : "Live, Love, Laugh"}
            </span>
          </div>
        </div>
        {/* <Link to="/upload" className="btn btn-primary mt-4  ">
          Create a Post
        </Link> */}
      </div>
    </>
  );
};

export default ProfileCard;
