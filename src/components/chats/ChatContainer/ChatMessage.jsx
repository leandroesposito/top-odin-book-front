import useFetch from "../../../hooks/useFetch";
import { getUserId } from "../../../session/sessionManager";
import "./ChatMessage.css";
import FlashMessage from "../../parts/FlashMessage/FlashMessage";

export default function ChatMessage({ id, userId, body, createdAt, pictures }) {
  const { loading, data, errors, makeRequest } = useFetch();

  function onDelete() {
    makeRequest(`/messages/${id}`, "DELETE");
  }

  const isMine = userId === getUserId();

  if (data && data.success) {
    // data.success means message is deleted
    return null;
  }

  return (
    <div className={`chat-message ${isMine ? "mine" : ""}`}>
      {Array.isArray(pictures) &&
        pictures.map((p) => {
          return <img src={p.url} key={p.id} />;
        })}
      <pre className="message-content">{body}</pre>
      {errors.map((error, index) => (
        <FlashMessage message={error} type={"error"} key={index} />
      ))}
      <div className="message-date">{new Date(createdAt).toLocaleString()}</div>
      {isMine && (
        <button
          className="delete-message-button danger round"
          aria-label="Delete message"
          onClick={onDelete}
          disabled={loading}
        >
          Delete
        </button>
      )}
    </div>
  );
}
