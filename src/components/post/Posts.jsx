import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Loading from "../parts/Loading/Loading";
import FlashMessage from "../parts/FlashMessage/FlashMessage";
import Post from "./Post";
import PostForm from "../postForm/PostForm";
import { isLogedIn } from "../../session/sessionManager";
import { Navigate } from "react-router";

export default function Posts({ userId }) {
  const { loading, errors, data, makeRequest } = useFetch();

  useEffect(() => {
    if (userId) {
      makeRequest(`/users/${userId}/posts`);
    } else {
      makeRequest(`/posts/feed`);
    }
  }, [makeRequest, userId]);

  if (!userId && !isLogedIn()) {
    return <Navigate to={"/"} />;
  }

  if (!loading && !data && errors.length == 0) {
    return null;
  }

  if (loading) {
    return <Loading />;
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
    <>
      {typeof userId === "undefined" && <PostForm />}
      <div className="posts">
        {Array.isArray(data?.posts) &&
          data.posts.map((post) => {
            return <Post post={post} key={post.id} />;
          })}
      </div>
    </>
  );
}
