import React from "react";
import ProfileCard from "../profileCard/ProfileCard";
import Posts from "../posts/Posts";
import RightSide from "../rightside/RightSide";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mx-auto">
      <div className=" row mt-4 d-flex justify-content-between ">
        <div className="col-md-3 container ">
          <ProfileCard />
          <div className="d-flex align-items-center justify-content-center">
            <Link to="/upload" className="btn btn-primary my-4  ">
              Create a Post
            </Link>
          </div>
        </div>
        <Posts />
        <RightSide />
      </div>
    </div>
  );
};

export default Home;
