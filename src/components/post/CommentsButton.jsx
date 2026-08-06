function CommentsButton({
  commentsCount,
  onCommentsButtonClick,
  deletedComments,
}) {
  function onClick() {
    onCommentsButtonClick();
  }

  return (
    <button className={`comments-post-button`} onClick={onClick}>
      Comments ({commentsCount - deletedComments})
    </button>
  );
}

export default CommentsButton;
