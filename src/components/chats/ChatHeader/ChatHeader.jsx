import "./ChatHeader.css";

export default function ChatHeader({ currentChat }) {
  return (
    <div className="chat-header">
      <a
        href={`/profile/${currentChat.id}`}
        aria-live="polite"
        aria-relevant="text"
      >
        <div className="name">{currentChat.name}</div>
      </a>
    </div>
  );
}
