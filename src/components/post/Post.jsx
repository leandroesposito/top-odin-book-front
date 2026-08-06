import { useCallback, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Loading from "../parts/Loading/Loading";
import FlashMessage from "../parts/FlashMessage/FlashMessage";
import { useParams } from "react-router";
import { getUserId } from "../../session/sessionManager";
import PostButtons from "./PostButtons";
import LikeButton from "./LikeButton";
import CommentsButton from "./CommentsButton";
import Comments from "./comment/Comments";

function Post(props) {
  const { loading, data, errors, makeRequest } = useFetch();
  const [deleted, setDeleted] = useState(false);
  const [viewComments, setViewComments] = useState(false);
  const [deletedComments, setDeletedComments] = useState(0);
  const postIdParam = useParams().postId;
  const postId = postIdParam || props.postId;

  useEffect(() => {
    makeRequest(`/posts/${postId}`, "GET");
  }, [makeRequest, postId]);

  function onDelete() {
    setDeleted(true);
  }

  const onDeleteComment = useCallback(function () {
    setDeletedComments((value) => value + 1);
  }, []);

  function onCommentsButtonClick() {
    setViewComments(true);
  }

  if (deleted || (!loading && !data && errors.length == 0)) {
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
    <div className="post">
      <div className="flash-messages">
        {errors.map((error, index) => (
          <FlashMessage message={error} type={"error"} key={index} />
        ))}
        {data !== null && typeof data.message !== "undefined" && (
          <FlashMessage message={data.message} type={"success"} />
        )}
      </div>
      <div className="author">
        <div className="avatar">
          <a href={`/profile/${data.post.user_id}`}>
            <img
              src={data.post.profile_picture_url}
              alt={`${data.post.author}'s avatar`}
            />
          </a>
        </div>
        <div className="author-name">
          <a href={`/profile/${data.post.user_id}`}>{data.post.author}</a>
        </div>
        {data.post.user_id === getUserId() && (
          <PostButtons post={data.post} onDelete={onDelete} />
        )}
      </div>
      <div className="post-date">
        {new Date(data.post.created_at).toLocaleString()}
      </div>
      <div className="post-content">{data.post.body}</div>
      {data !== null &&
        typeof data.post?.pictures !== "undefined" &&
        data.post.pictures.length > 0 && (
          <div className="post-pictures">
            {data.post.pictures.map((picture) => {
              return (
                <div className="post-picture" key={picture.id}>
                  <img src={picture.url} />
                </div>
              );
            })}
          </div>
        )}
      <div className="post-bottom-buttons">
        <LikeButton post={data.post} />
        <CommentsButton
          commentsCount={data.post.comments_count}
          onCommentsButtonClick={onCommentsButtonClick}
          deletedComments={deletedComments}
        />
      </div>
      {viewComments && (
        <Comments postId={postId} onDeleteComment={onDeleteComment} />
      )}
    </div>
  );
}

export default Post;
