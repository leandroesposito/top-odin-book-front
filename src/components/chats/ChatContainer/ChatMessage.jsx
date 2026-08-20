import useFetch from "../../../hooks/useFetch";
import { getUserId } from "../../../session/sessionManager";
import "./ChatMessage.css";
import FlashMessages from "../../parts/FlashMessage/FlashMessages";
import { Trash2 } from "lucide-react";

export default function ChatMessage({ id, userId, body, createdAt, pictures }) {
  const { loading, success, errors, makeRequest } = useFetch();

  function onDelete() {
    makeRequest(`/messages/${id}`, "DELETE");
  }

  const isMine = userId === getUserId();

  if (success) {
    // success means message is deleted
    return null;
  }

  return (
    <div className={`chat-message ${isMine ? "mine" : ""}`}>
      {Array.isArray(pictures) && (
        <div className="message-pictures">
          {pictures.map((p) => {
            return (
              <div className="message-picture" key={p.id}>
                <img src={p.url} />
              </div>
            );
          })}
        </div>
      )}
      <pre className="message-content">{body}</pre>
      <FlashMessages errors={errors} />
      <div className="message-date">{new Date(createdAt).toLocaleString()}</div>
      {isMine && (
        <button
          className="delete-message-button danger round button"
          aria-label="Delete message"
          onClick={onDelete}
          disabled={loading}
        >
          <Trash2 />
        </button>
      )}
    </div>
  );
}
