import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Header from "../navbar/Header";
import Comment from "../comment/Comment";

const PostDetails = () => {
  const [post, setPost] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isCommentEmpty, setIsCommentEmpty] = useState(false);
  const [isCommentLong, setIsCommentLong] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  const female =
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200";

  const postImage =
    "https://images.pexels.com/photos/29010901/pexels-photo-29010901/free-photo-of-stylish-table-setting-with-chic-decor-in-sao-paulo.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `https://backend-social3.vercel.app/post/find/${id}`
        );
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.log(error);
      }
    };
    id && fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `https://backend-social3.vercel.app/comment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.log(error);
      }
    };
    post && fetchComments();
  }, [post._id]);

  const handlePostComment = async () => {
    if (commentText === "") {
      setIsCommentEmpty(true);
      setTimeout(() => {
        setIsCommentEmpty(false);
      }, 2000);
      return;
    }

    if (commentText.length > 50) {
      setIsCommentLong(true);
      setTimeout(() => {
        setIsCommentLong(false);
      }, 2000);
      return;
    }

    try {
      const res = await fetch(`https://backend-social3.vercel.app/comment`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ commentText, post: post._id }),
      });
      const data = await res.json();
      setComments((prev) => [...prev, data]);
      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="d-flex  row" style={{ marginTop: "1.5rem" }}>
          <div className="col-md-6 bg-dark">
            <img
              src={post?.photo && post?.photo !== "" ? post?.photo : postImage}
              alt=""
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                opacity: "0.95",
              }}
            />
          </div>
          <div className="d-flex flex-column justify-content-between col-md-6">
            <div style={{ border: "1px solid #333", width: "100%" }}>
              <Link
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  padding: "0.75rem 2rem",
                  gap: "1.5rem",
                }}
                to={`profileDetails/${post?.user?._id}`}
                className="d-flex align-items-center"
              >
                <img
                  className="rounded-circle"
                  style={{ height: "55px", width: "55px", objectFit: "cover" }}
                  src={female}
                  alt=""
                />
                <div className="d-flex flex-column" style={{ gap: "8px" }}>
                  <span
                    style={{
                      textTransform: "capitalize",
                      color: "#222",
                      fontSize: "24px",
                      fontWeight: "500",
                    }}
                  >
                    {post?.user?.username}
                  </span>
                  <span style={{ color: "#444", fontSize: "15px" }}>
                    {post?.location
                      ? post?.location
                      : "Somewhere around the globe"}
                  </span>
                </div>
              </Link>
            </div>

            {/* {comment section} */}
            <div
              className="d-flex flex-column overflow-y-auto"
              style={{
                gap: "1.75rem",
                height: "550px",
                padding: "1.5rem 0.75rem",
              }}
            >
              {comments?.length > 0 ? (
                comments.map((comment) => (
                  <Comment c={comment} key={comment._id} />
                ))
              ) : (
                <h3
                  style={{
                    margin: "2.5rem",
                    fontSize: "26px",
                    textAlign: "center",
                  }}
                >
                  No comments yet
                </h3>
              )}
            </div>
            <div
              style={{
                borderTop: "1px solid #666",
                width: "100%",
                margin: "0 auto",
                padding: "0.75rem",
              }}
            >
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                type="text"
                placeholder="Type comment..."
                style={{
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: "17px",
                  width: "90%",
                  paddingLeft: "0.5rem",
                  transition: "150ms all",
                }}
              />
              <button
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "18px",
                  color: "#285ad8",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  transition: "150ms all ease-in-out",
                }}
                onClick={handlePostComment}
              >
                Post
              </button>
            </div>
            {isCommentEmpty && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: "1.5rem",
                  marginLeft: "1rem",
                  color: "#f00",
                  fontSize: "18px",
                }}
              >
                You can't post empty comment!
              </span>
            )}
            {isCommentLong && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: "1.5rem",
                  marginLeft: "1rem",
                  color: "#f00",
                  fontSize: "18px",
                }}
              >
                Comment is too long
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetails;
