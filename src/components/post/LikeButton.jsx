import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { isLogedIn } from "../../session/sessionManager";
import { Heart } from "lucide-react";

function LikeButton({ post }) {
  const { loading, data, errors, makeRequest } = useFetch();
  const [liked, setLiked] = useState(post.liked);

  useEffect(() => {
    if (data && typeof data.liked !== "undefined") {
      setTimeout(() => {
        setLiked(data.liked);
      });
    }
  }, [data]);

  useEffect(() => {
    for (const error of errors) {
      console.error(error);
    }
  }, [errors]);

  function onLikeClick() {
    if (liked) {
      makeRequest(`/posts/${post.id}/like`, "DELETE");
    } else {
      makeRequest(`/posts/${post.id}/like`, "POST");
    }
  }

  if (!isLogedIn()) {
    return null;
  }

  return (
    <button
      className={`like-post-button button ${liked ? "dislike-post-button" : ""}`}
      disabled={loading}
      onClick={onLikeClick}
    >
      <Heart /> (
      {post.likes_count + (liked !== post.liked ? (liked ? 1 : -1) : 0)})
    </button>
  );
}

export default LikeButton;
