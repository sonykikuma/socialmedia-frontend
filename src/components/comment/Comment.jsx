import React, { useState } from "react";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../util/capitalizeFirstLetter";
import { format } from "timeago.js";

const Comment = ({ c, deleteComment }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState(c);
  const [isLiked, setIsLiked] = useState(comment?.likes?.includes(user._id));

  const female =
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200";

  const handleLikeComment = async () => {
    try {
      await fetch(
        `https://backend-social3.vercel.app/comment/toggleLike/${c?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "PUT",
        }
      );

      setComment((prev) => {
        return {
          ...prev,
          likes: isLiked
            ? [...prev.likes.filter((id) => id !== user._id)]
            : [...prev.likes, user._id],
        };
      });
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await fetch(`https://backend-social3.vercel.app/comment/${comment._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Make sure to handle token
        },
      });
      // Remove the deleted comment from the state in the parent component
      deleteComment(comment._id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ padding: "0.25rem 0.5rem" }}
    >
      <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
        <img
          src={comment?.user?.profileImg || female}
          alt=""
          className="rounded-circle"
          style={{ width: "36px", height: "36px", objectFit: "cover" }}
        />
        <div className="d-flex flex-column" style={{ marginRight: "1.5rem" }}>
          <span style={{ fontWeight: "500" }}>
            {comment?.user?.username
              ? capitalizeFirstLetter(comment?.user?.username)
              : ""}
          </span>
          <span className="" style={{ fontSize: "15px", color: "#666" }}>
            {format(comment?.createdAt)}
          </span>
        </div>
        <div>{comment?.commentText}</div>
      </div>
      <div
        className="d-flex  align-items-center "
        style={{ gap: "0.25rem", cursor: "pointer" }}
      >
        {isLiked ? (
          <span onClick={handleLikeComment}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              // fill="currentColor"
              fill="red"
              class="bi bi-heart-fill"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
              />
            </svg>
          </span>
        ) : (
          <span onClick={handleLikeComment}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-heart"
              viewBox="0 0 16 16"
            >
              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
            </svg>
          </span>
        )}
        <span>{comment?.likes?.length || 0}</span>
        {/* <span>likes</span> */}
      </div>
      {comment?.user?._id === user._id && (
        <span
          onClick={handleDeleteComment}
          className=" text-danger "
          style={{ cursor: "pointer" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash3"
            viewBox="0 0 16 16"
          >
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
          </svg>{" "}
        </span>
      )}
    </div>
  );
};

export default Comment;
