import React, { useState } from "react";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../util/capitalizeFirstLetter";
import { format } from "timeago.js";

const Comment = ({ c }) => {
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
        className="d-flex flex-column align-items-center"
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
        <span>likes</span>
      </div>
    </div>
  );
};

export default Comment;
