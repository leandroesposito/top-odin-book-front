import { useState } from "react";
import ChatsList from "./ChatsList/ChatsList";
import MainPanel from "./MainPanel/MainPanel";
import { isLogedIn } from "../../session/sessionManager";
import { Navigate, useLocation } from "react-router";

export default function ChatsScreen() {
  const location = useLocation();
  const [currentChat, setCurrentChat] = useState(
    location.state?.currentChat ?? { id: null },
  );

  function onChatClick(event) {
    const buttonData = event.target.closest("button.chat-item, button").dataset;

    setCurrentChat({
      id: parseInt(buttonData.id),
      name: buttonData.name,
    });
  }

  if (!isLogedIn()) {
    return <Navigate to={"/log-in"} />;
  }

  return (
    <>
      <main>
        <ChatsList onChatClick={onChatClick} currentChat={currentChat} />
        <MainPanel currentChat={currentChat} />
      </main>
    </>
  );
}
