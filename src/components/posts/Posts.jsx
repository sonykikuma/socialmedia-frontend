import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Post from "../post/Post";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [sortType, setSortType] = useState("date");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `https://backend-social3.vercel.app/post/timeline/posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.log(Error);
      }
    };
    fetchPost();
  }, []);

  const sortPosts = (posts) => {
    if (sortType === "date") {
      return [...posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortType === "trending") {
      return [...posts].sort((a, b) => b.likes.length - a.likes.length);
    }
    return posts;
  };
  const sortedPosts = sortPosts(posts);

  return (
    <>
      {" "}
      {/* <div className="container col-md-6"> */}
      <div
        className="d-flex align-items-center justify-content-center mb-4"
        style={{ gap: "20px" }}
      >
        <button
          className="btn btn-primary me-2"
          onClick={() => setSortType("date")}
        >
          Sort by Date
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setSortType("trending")}
        >
          Sort by Trending
        </button>
      </div>
      {/* {Array.isArray(posts) && posts.length > 0 ? ( */}
      {Array.isArray(sortedPosts) && sortedPosts.length > 0 ? (
        sortedPosts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        // sortPosts(posts)?.map((post) => <Post key={post._id} post={post} />)
        <p>No posts available.</p>
      )}
      {/* </div> */}
    </>
  );
};

export default Posts;
