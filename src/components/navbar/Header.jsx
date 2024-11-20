import React from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Header = () => {
  const { token, user } = useSelector((state) => state.auth);
  const female =
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-bottom">Homepage </Tooltip>}
            >
              <NavLink to="/user" className="navbar-brand fw-bold text-primary">
                MyWebsite
              </NavLink>
            </OverlayTrigger>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse  justify-content-end"
              id="navbarNav"
            >
              <div
                className="d-flex mt-1 align-items-center "
                style={{ gap: "8px" }}
              >
                {/* {tooltip testing} */}
                <NavLink to="/user">
                  {" "}
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip-bottom">Homepage </Tooltip>}
                  >
                    <span className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-person"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"
                          onClick={() => navigate(`/profileDetails/{user._id}`)}
                        />
                      </svg>{" "}
                    </span>
                  </OverlayTrigger>
                </NavLink>{" "}
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-bottom" className="text-primary">
                      Logout{" "}
                    </Tooltip>
                  }
                >
                  <span className="" onClick={handleLogout}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      className="bi bi-box-arrow-right text-primary"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                      />
                    </svg>
                  </span>
                </OverlayTrigger>
                <NavLink to="/updateprofile">
                  <OverlayTrigger
                    className="bg-primary"
                    placement="bottom"
                    overlay={
                      <Tooltip id="tooltip-bottom">Update Profile </Tooltip>
                    }
                  >
                    <img
                      src={user?.profileImg ? user?.profileImg : female}
                      alt="female"
                      className="rounded-circle "
                      style={{
                        width: "35px",
                        height: "35px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  </OverlayTrigger>
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <hr />
    </>
  );
};

export default Header;
