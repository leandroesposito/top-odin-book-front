import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router";
import { SquarePen, Trash2 } from "lucide-react";

function PostButtons({ post, onDelete }) {
  const { loading, success, errors, makeRequest } = useFetch();

  useEffect(() => {
    if (success) {
      onDelete();
    }
  }, [success, onDelete]);

  useEffect(() => {
    for (const error of errors) {
      console.error(error);
    }
  }, [errors]);

  function onDeleteClick() {
    if (confirm("Are you sure you want to DELETE this post?")) {
      makeRequest(`/posts/${post.id}`, "DELETE");
    }
  }

  return (
    <div className="post-buttons buttons">
      <button
        className="delete-post-button button delete-button"
        disabled={loading}
        onClick={onDeleteClick}
        aria-label="Delete post"
      >
        <Trash2 />
      </button>
      <Link
        to={`/post/${post.id}/edit`}
        className="button"
        aria-label="Edit post"
      >
        <SquarePen />
      </Link>
    </div>
  );
}

export default PostButtons;
