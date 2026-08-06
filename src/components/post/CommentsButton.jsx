function CommentsButton({ commentsCount, onCommentsButtonClick }) {
  function onClick() {
    onCommentsButtonClick();
  }

  return (
    <button className={`comments-post-button`} onClick={onClick}>
      Comments ({commentsCount})
    </button>
  );
}

export default CommentsButton;
