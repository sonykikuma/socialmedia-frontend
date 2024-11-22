import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "timeago.js";
import { capitalizeFirstLetter } from "../../util/capitalizeFirstLetter";
import Comment from "../comment/Comment";
import { bookmarkPost } from "../../features/authSlice";
import { updatePost } from "../../features/postSlice";

const Post = ({ post }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isCommentEmpty, setIsCommentEmpty] = useState(false);
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(user._id));
  const [isBookmark, setIsBookmark] = useState(
    user?.bookmarkedPosts?.some(
      (bookmarkedPost) => bookmarkedPost._id == post._id
    )
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.desc);
  const [editedImage, setEditedImage] = useState(null);
  const dispatch = useDispatch();

  const female =
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `https://backend-social3.vercel.app/comment/${post._id}`,
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
    fetchComments();
  }, [post._id]);

  //delete post
  const deletePost = async () => {
    try {
      await fetch(`https://backend-social3.vercel.app/post/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      });
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  //editing post
  const handleEditPost = async () => {
    if (!editedContent.trim()) return;

    //editing image of a post
    const formData = new FormData();
    formData.append("desc", editedContent);
    if (editedImage) {
      formData.append("photo", editedImage);
    }

    try {
      const res = await fetch(
        `https://backend-social3.vercel.app/post/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", //when using formdata we don't set this manually
          },
          method: "PUT",
          //body: formData,
          body: JSON.stringify({ desc: editedContent }),
        }
      );

      if (res.ok) {
        const updatedPost = await res.json();
        //dispatch(updatePost({ id: post._id, updatedDesc: updatedPost.desc }));

        setEditedContent(updatedPost.desc);
        setIsEditing(false);
        window.location.reload(); //used here for refreshing but  Not recommended for smooth UX
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikePost = async () => {
    try {
      await fetch(
        `https://backend-social3.vercel.app/post/toggleLike/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "PUT",
        }
      );
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookmark = async () => {
    try {
      await fetch(
        `https://backend-social3.vercel.app/user/bookmark/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "PUT",
        }
      );
      dispatch(bookmarkPost(post));
      setIsBookmark((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePostComment = async () => {
    if (commentText === "") {
      setIsCommentEmpty(true);
      setTimeout(() => {
        setIsCommentEmpty(false);
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
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center mb-4 position-relative ">
      <div
        className="rounded border pb-1 overflow-hidden shadow"
        style={{ width: "400px" }}
      >
        <div
          className="d-flex justify-content-between align-items-center"
          style={{
            paddingBottom: "1rem",
            marginTop: "8px",
            borderBottom: "1px solid #333",
            paddingLeft: "12px",
            paddingRight: "12px",
          }}
        >
          <Link
            to={`/profileDetails/${post?.user?._id}`}
            className="d-flex align-items-center"
            style={{ textDecoration: "none", color: "#222", gap: "8px" }}
          >
            <img
              src={post?.user?.profileImg ? post?.user?.profileImg : female}
              //src={post?.user?.profileImg || female}
              alt=""
              className="border rounded-circle"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            {/* <p>Profile Image URL: {post?.user?.profileImg}</p> just to test if image url is coming or not */}

            <div className="d-flex flex-column">
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                {capitalizeFirstLetter(post?.user?.username)}
              </span>
              <span style={{ fontSize: "15px", color: "#555" }}>
                {format(post.createdAt)}
              </span>
            </div>
          </Link>
          {user._id === post?.user?._id && (
            <>
              {/* <span onClick={() => setIsEditing((prev) => !prev)}>Edit</span> */}

              <span
                onClick={() => setShowDeleteModal((prev) => !prev)}
                style={{ cursor: "pointer" }}
              >
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-three-dots-vertical"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                </svg>
              </span>
            </>
          )}
          {showDeleteModal && (
            <div
              className="position-absolute d-flex flex-column rounded"
              style={{
                right: "1.5rem",
                top: "2rem",
                backgroundColor: "#878181",
                color: "#fff",
                gap: "8px",
                padding: "8px",
              }}
            >
              <h3>Delete Post</h3>
              <div
                className="d-flex justify-content-center"
                style={{ gap: "0.75rem" }}
              >
                <button
                  style={{
                    outline: "none",
                    border: "none",
                    padding: "0.2rem 0.4rem",
                    borderRadius: "6px",
                  }}
                  onClick={deletePost}
                >
                  Yes
                </button>
                <button
                  style={{
                    outline: "none",
                    border: "none",
                    padding: "0.2rem 0.4rem",
                    borderRadius: "6px",
                  }}
                  onClick={() => setShowDeleteModal((prev) => !prev)}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
        {/* editing  feature */}
        <div>
          {isEditing && (
            <div style={{ padding: "1rem" }}>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{ width: "100%", minHeight: "100px" }}
              />
              {/* <input
                type="file"
                onChange={(e) => setEditedImage(e.target.files[0])}
                style={{ marginTop: "0.5rem" }}
              /> */}
              <button onClick={handleEditPost} style={{ marginTop: "1rem" }}>
                Save
              </button>
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize: "18px", color: "#333", padding: "1rem" }}>
            {post.desc}
          </div>
          {post?.location && (
            <div style={{ color: "#333", padding: "1rem" }}>
              Location: {post.location}
            </div>
          )}

          <img
            style={{ height: "400px", width: "100%", objectFit: "cover" }}
            src={
              post?.photo
                ? post?.photo
                : "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200"
            }
            alt="post"
          />
        </div>
        <div
          className={`d-flex justify-content-between align-items-center p-2 fs-4 ${
            showComment ? "border-bottom" : ""
          }`}
        >
          <div className="d-flex align-items-center" style={{ gap: "8px" }}>
            {isLiked ? (
              <span onClick={handleLikePost}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="red"
                  className="bi bi-heart-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                  />
                </svg>
              </span>
            ) : (
              <span onClick={handleLikePost}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-heart"
                  viewBox="0 0 16 16"
                >
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                </svg>
              </span>
            )}
            <span onClick={() => setShowComment((prev) => !prev)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-chat"
                viewBox="0 0 16 16"
              >
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
              </svg>
            </span>
          </div>
          <div className="d-flex " style={{ gap: "8px" }}>
            {user._id === post?.user?._id && (
              <span onClick={() => setIsEditing((prev) => !prev)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                </svg>{" "}
              </span>
            )}

            <div onClick={handleBookmark}>
              {isBookmark ? (
                <span style={{ cursor: "pointer" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-bookmark-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                  </svg>
                </span>
              ) : (
                <span style={{ cursor: "pointer" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-bookmark"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>

        {showComment && (
          <>
            <div
              className="overflow-auto d-flex flex-column"
              style={{
                gap: "1.75rem",
                padding: "1.5rem 0.75rem",
                paddingLeft: "0",
                borderBottom: "1px solid #555",
              }}
            >
              {comments?.length > 0 ? (
                comments.map((comment) => (
                  <Comment c={comment} key={comment._id} />
                ))
              ) : (
                <span style={{ marginLeft: "12px", fontSize: "20px" }}>
                  No comments
                </span>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center p-2 ">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                type="text"
                className="form-control p-0 ps-2"
                style={{
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: "17px",
                  transition: "150ms all",
                }}
                placeholder="Comment here..."
              />
              {/* {commentText} */}
              <button className="text-primary " onClick={handlePostComment}>
                Post
              </button>
            </div>
            {isCommentEmpty && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: "1.5rem",
                  marginLeft: "1rem",
                  fontSize: "18px",
                }}
              >
                You can't post empty comment
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
