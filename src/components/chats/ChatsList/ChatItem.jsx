import Avatar from "../../parts/Avatar";

export default function ChatItem({
  id,
  name,
  lastMessageTime,
  unreadCount,
  profile_picture_url,
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
        <Avatar
          data={{ id, name, profile_picture_url }}
          size={2}
          addAnchor={false}
        />
        <div className="chat-item-info">
          <div className="name">{name}</div>
          {lastMessageTime !== null && (
            <div className="last-message-time">{lastMessageTimeString}</div>
          )}
        </div>
      </div>
      <div className="right">
        {parseInt(unreadCount) > 0 && (
          <div className="unread-count">{unreadCount}</div>
        )}
      </div>
    </button>
  );
}
