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

        {/* <Link
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
        </Link> */}
        <Link to={`/mypost/${user?._id}`} style={{ textDecoration: "none" }}>
          <h3
            className="text-primary"
            style={{
              textDecoration: "none",
              //  color: "#0e5ad4",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            My Profile
          </h3>
        </Link>
        <Link
          to={`/bookmarks/${user?._id}`}
          style={{ textDecoration: "none", marginBottom: "12px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-bookmark"
            viewBox="0 0 16 16"
          >
            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
          </svg>{" "}
          Bookmarks
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
