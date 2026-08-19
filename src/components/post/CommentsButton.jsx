import { MessageCircleMore } from "lucide-react";

function CommentsButton({
  commentsCount,
  onCommentsButtonClick,
  deletedComments,
}) {
  function onClick() {
    onCommentsButtonClick();
  }

  return (
    <button
      className={`comments-post-button button`}
      onClick={onClick}
      aria-label="Comments"
    >
      <MessageCircleMore /> ({commentsCount - deletedComments})
    </button>
  );
}

export default CommentsButton;
