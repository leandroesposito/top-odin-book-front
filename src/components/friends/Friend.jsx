import { Link, useNavigate } from "react-router";

export default function Friend({ user }) {
  const navigate = useNavigate();

  function onMessageClick(user) {
    navigate("/messages", {
      state: { currentChat: { id: user.id, name: user.name } },
    });
  }

  return (
    <div className="user-item">
      <div className="avatar">
        <Link to={`/profile/${user.id}`}>
          <img src={user.profile_picture_url} alt={`${user.name}'s avatar`} />
        </Link>
      </div>

      <div className="name">
        <Link to={`/profile/${user.id}`}>{user.name}</Link>
      </div>
      <div className="buttons">
        <button
          onClick={() => {
            onMessageClick(user);
          }}
        >
          Message
        </button>
      </div>
    </div>
  );
}
