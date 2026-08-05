import ChatContainer from "../ChatContainer/ChatContainer";
import NewMessageForm from "../NewMessageForm/NewMessageForm";
import ChatHeader from "../ChatHeader/ChatHeader";
import "./MainPanel.css";

export default function MainPanel({ currentChat }) {
  return (
    <div className="main-panel">
      {currentChat.id !== null && (
        <>
          <ChatHeader currentChat={currentChat} />
          <ChatContainer currentChat={currentChat} />
          <NewMessageForm currentChat={currentChat} />
        </>
      )}
    </div>
  );
}
