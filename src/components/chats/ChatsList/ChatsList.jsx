import { useEffect } from "react";
import useFetch from "../../../hooks/useFetch";
import ChatItem from "./ChatItem";
import Loading from "../../parts/Loading/Loading";
import FlashMessages from "../../parts/FlashMessage/FlashMessages";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";

export default function ChatsList({ onChatClick, currentChat }) {
  const { loading, data, errors, makeRequest } = useFetch();

  useEffect(() => {
    let intervalId = null;
    const pollInterval = 2500;
    const idleInterval = 5000;
    const hiddenInterval = 30000;

    const getChats = () => {
      if (errors.length) {
        return;
      }
      makeRequest("/messages", "GET");
    };

    const schedule = (ms) => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = setInterval(getChats, ms);
    };

    const updateInterval = () => {
      if (document.hidden) {
        schedule(hiddenInterval);
      } else if (document.hasFocus && !document.hasFocus()) {
        schedule(idleInterval);
      } else {
        schedule(pollInterval);
      }
    };

    getChats();
    updateInterval();

    const onVisibility = () => updateInterval();
    const onFocus = () => updateInterval();
    const onBlur = () => updateInterval();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, [makeRequest, errors]);

  return (
    <div className="chats-list">
      <div className="back-button">
        <Link to={"/"}>
          <div className="button round">
            <ChevronLeft />
          </div>
          Back
        </Link>
      </div>
      <div className="chats-list-header">
        <h2>Chats</h2>
      </div>
      {loading && data === null && <Loading size={4} />}
      <FlashMessages errors={errors} />
      {data !== null &&
        data.chats.length > 0 &&
        data.chats.map((chat) => {
          return (
            <ChatItem
              {...chat}
              isOpen={currentChat.id === chat.id}
              key={chat.id}
              onChatClick={onChatClick}
            />
          );
        })}
    </div>
  );
}
