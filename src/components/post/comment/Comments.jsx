import { useCallback, useEffect } from "react";
import useFetch from "../../../hooks/useFetch";
import Loading from "../../parts/Loading/Loading";
import FlashMessage from "../../parts/FlashMessage/FlashMessage";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

export default function Comments({ postId, onDeleteComment }) {
  const { loading, data, errors, makeRequest } = useFetch();

  const reloadComments = useCallback(() => {
    makeRequest(`/posts/${postId}/comments`);
  }, [makeRequest, postId]);

  useEffect(() => {
    reloadComments();
  }, [reloadComments]);

  if (loading) {
    return <Loading />;
  }

  if (!data && errors) {
    return (
      <div className="flash-messages">
        {errors.map((error, index) => (
          <FlashMessage message={error} type={"error"} key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="comments">
      <div className="flash-messages">
        {errors.map((error, index) => (
          <FlashMessage message={error} type={"error"} key={index} />
        ))}
        {data !== null && typeof data.message !== "undefined" && (
          <FlashMessage message={data.message} type={"success"} />
        )}
      </div>
      <CommentForm postId={postId} onNewComment={reloadComments} />
      {typeof data?.comments !== "undefined" &&
        data.comments.map((comment) => {
          return (
            <Comment
              comment={comment}
              key={comment.id}
              onDeleteComment={onDeleteComment}
            />
          );
        })}
    </div>
  );
}
