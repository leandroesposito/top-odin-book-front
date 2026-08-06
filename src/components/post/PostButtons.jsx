import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";

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
    <div className="post-buttons">
      <button
        className="delete-post-button"
        disabled={loading}
        onClick={onDeleteClick}
      >
        Delete
      </button>
      <a href={`/post/${post.id}/edit`}>Edit</a>
    </div>
  );
}

export default PostButtons;
