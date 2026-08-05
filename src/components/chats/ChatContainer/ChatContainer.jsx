import { useEffect, useRef } from "react";
import useFetch from "../../../hooks/useFetch";
import Loading from "../../parts/Loading/Loading";
import ChatMessage from "./ChatMessage";
import "./ChatContainer.css";
import FlashMessage from "../../parts/FlashMessage/FlashMessage";

export default function ChatContainer({ currentChat }) {
  const { loading, data, errors, makeRequest, reset } = useFetch();
  const chatEnding = useRef(null); // used to scroll on opening and new messages

  useEffect(() => {
    let intervalId = null;
    const pollInterval = 2500;
    const idleInterval = 5000;
    const hiddenInterval = 30000;

    const getMessages = () => {
      if (errors.length) {
        return;
      }

      makeRequest(`/messages/user/${currentChat.id}`, "GET");
    };

    const schedule = (ms) => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = setInterval(getMessages, ms);
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

    getMessages();
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
  }, [currentChat, makeRequest, errors]);

  useEffect(() => {
    setTimeout(() => {
      if (chatEnding.current) {
        chatEnding.current.scrollIntoView();
      }
    }, 50);
    reset();
  }, [currentChat, reset]);

  useEffect(() => {
    // const { scrollTop, scrollHeight, clientHeight } =
    //   chatEnding.current.parentElement;
    // const { y } = chatEnding.current.getBoundingClientRect();
    // const windowHeight = window.innerHeight;
    // // const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    // const distanceFromBottom = y - windowHeight;
    // if (distanceFromBottom < 100) {
    //   chatEnding.current.scrollIntoView();
    // }
  }, [data]);

  return (
    <div
      className="messages-container"
      aria-live="polite"
      aria-relevant="additions"
    >
      {loading && data === null && <Loading size={4} />}
      {data !== null &&
        data.messages.length > 0 &&
        data.messages.map((m) => {
          return <ChatMessage key={m.id} {...m} />;
        })}
      {data !== null && typeof data.message !== "undefined" && (
        <FlashMessage type={"success"} message={data.message} />
      )}
      {errors &&
        errors.length > 0 &&
        errors.map((e, index) => {
          return <FlashMessage type={"error"} message={e} key={index} />;
        })}
      <div ref={chatEnding}></div>
    </div>
  );
}
