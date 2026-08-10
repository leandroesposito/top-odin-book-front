import { Link } from "react-router";
import "./ChatHeader.css";

export default function ChatHeader({ currentChat }) {
  return (
    <div className="chat-header">
      <Link
        to={`/profile/${currentChat.id}`}
        aria-live="polite"
        aria-relevant="text"
      >
        <div className="name">{currentChat.name}</div>
      </Link>
    </div>
  );
}
