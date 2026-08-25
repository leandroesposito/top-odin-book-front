import "./Post.css";
import { useCallback, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Loading from "../parts/Loading/Loading";
import FlashMessages from "../parts/FlashMessage/FlashMessages";
import { Link, useParams } from "react-router";
import { getUserId, isLogedIn } from "../../session/sessionManager";
import PostButtons from "./PostButtons";
import LikeButton from "./LikeButton";
import CommentsButton from "./CommentsButton";
import Comments from "./comment/Comments";
import Avatar from "../parts/Avatar";

function Post(props) {
  const { loading, data, errors, makeRequest } = useFetch();
  const [deleted, setDeleted] = useState(false);
  const [viewComments, setViewComments] = useState(false);
  const [deletedComments, setDeletedComments] = useState(0);
  const postIdParam = useParams().postId;
  const postId = postIdParam || props.postId;
  const postProp = props.post;

  useEffect(() => {
    if (!postProp) {
      makeRequest(`/posts/${postId}`, "GET");
    }
  }, [makeRequest, postId, postProp]);

  function onDelete() {
    setDeleted(true);
  }

  const onDeleteComment = useCallback(function () {
    setDeletedComments((value) => value + 1);
  }, []);

  function onCommentsButtonClick() {
    setViewComments(true);
  }

  if (deleted || (!postProp && !loading && !data && errors.length == 0)) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  if (!postProp && !data && errors.length > 0) {
    return <FlashMessages data={data} errors={errors} />;
  }

  const post = postProp || data.post;

  return (
    <article className="post">
      <FlashMessages data={data} errors={errors} />
      <div className="author">
        <Avatar data={post} size={3} />
        <div className="author-name">
          <Link to={`/profile/${post.user_id}`}>{post.author}</Link>
        </div>
        {isLogedIn() && post.user_id === getUserId() && (
          <PostButtons post={post} onDelete={onDelete} />
        )}
      </div>
      <time
        className="post-date"
        dateTime={new Date(post.created_at).toISOString()}
      >
        <Link to={`/post/${post.id}`}>
          {new Date(post.created_at).toLocaleString()}
        </Link>
      </time>
      <pre className="post-content">{post.body}</pre>
      {typeof post?.pictures !== "undefined" && post.pictures.length > 0 && (
        <div className="post-pictures">
          {post.pictures.map((picture) => {
            return (
              <div className="post-picture" key={picture.id}>
                <img src={picture.url} />
              </div>
            );
          })}
        </div>
      )}
      <div className="post-bottom-buttons buttons">
        <LikeButton post={post} />
        <CommentsButton
          commentsCount={post.comments_count}
          onCommentsButtonClick={onCommentsButtonClick}
          deletedComments={deletedComments}
        />
      </div>
      {viewComments && (
        <Comments postId={post.id} onDeleteComment={onDeleteComment} />
      )}
    </article>
  );
}

export default Post;
