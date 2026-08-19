import { useCallback, useEffect } from "react";
import useFetch from "../../../hooks/useFetch";
import Loading from "../../parts/Loading/Loading";
import FlashMessages from "../../parts/FlashMessage/FlashMessages";
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
    return <FlashMessages errors={errors} />;
  }

  return (
    <div className="comments">
      <FlashMessages data={data} errors={errors} />
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
