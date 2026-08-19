import "./Comment.css";
import { useEffect, useState } from "react";
import { getUserId, isLogedIn } from "../../../session/sessionManager";
import useFetch from "../../../hooks/useFetch";
import FlashMessages from "../../parts/FlashMessage/FlashMessages";
import { Link } from "react-router";
import Avatar from "../../parts/Avatar";
import { Trash2 } from "lucide-react";

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
    return <FlashMessages errors={errors} />;
  }

  return (
    <div className="comment">
      <div className="author">
        <Avatar data={comment} size={2} />
        <div className="author-name">
          <Link to={`/profile/${comment.user_id}`}>{comment.author}</Link>
        </div>
        {isLogedIn() && comment.user_id === getUserId() && (
          <div className="buttons">
            <button
              className="button delete-button"
              disabled={loading}
              onClick={onDeleteClick}
              aria-label="Delete comment"
            >
              <Trash2 />
            </button>
          </div>
        )}
      </div>
      <div className="comment-date">
        {new Date(comment.created_at).toLocaleString()}
      </div>
      <pre className="comment-content">{comment.body}</pre>
    </div>
  );
}
