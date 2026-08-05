export default function ChatItem({
  id,
  name,
  lastMessageTime,
  unreadCount,
  onChatClick,
  isOpen = false,
}) {
  const lastMessageTimeString = new Date(lastMessageTime)
    .toISOString()
    .substring(0, 10);

  return (
    <button
      className={`chat-item ${isOpen ? "is-open" : ""}`}
      data-id={id}
      data-name={name}
      onClick={onChatClick}
    >
      <div className="left">
        <div className="name">{name}</div>
      </div>
      <div className="right">
        {parseInt(unreadCount) > 0 ? (
          <div className="unread-count">{unreadCount}</div>
        ) : (
          <div></div>
        )}
        {lastMessageTime !== null && (
          <div className="last-message-time">{lastMessageTimeString}</div>
        )}
      </div>
    </button>
  );
}
