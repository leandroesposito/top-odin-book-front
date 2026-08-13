import { useEffect, useState } from "react";
import { getUserId, isLogedIn } from "../../../session/sessionManager";
import useFetch from "../../../hooks/useFetch";
import FlashMessage from "../../parts/FlashMessage/FlashMessage";
import { Link } from "react-router";

export default function Comment({ comment, onDeleteComment }) {
  const [deleted, setDeleted] = useState(false);
  const { loading, data, errors, success, makeRequest } = useFetch();

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setDeleted(true);
        onDeleteComment();
      });
    }
  }, [success, onDeleteComment]);

  function onDeleteClick() {
    if (confirm("Are you sure you want to DELETE this comment?")) {
      makeRequest(`/posts/${comment.post_id}/comments/${comment.id}`, "DELETE");
    }
  }

  if (deleted) {
    return null;
  }

  if (!data && errors.length > 0) {
    return (
      <div className="flash-messages">
        {errors.map((error, index) => (
          <FlashMessage message={error} type={"error"} key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="comment">
      <div className="author">
        <div className="avatar">
          <Link to={`/profile/${comment.user_id}`}>
            <img
              src={comment.profile_picture_url}
              alt={`${comment.author}'s avatar`}
            />
          </Link>
        </div>
        <div className="author-name">
          <Link to={`/profile/${comment.user_id}`}>{comment.author}</Link>
        </div>
        {isLogedIn() && comment.user_id === getUserId() && (
          <div className="buttons">
            <button disabled={loading} onClick={onDeleteClick}>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="comment-content">
        <pre>{comment.body}</pre>
      </div>
    </div>
  );
}
