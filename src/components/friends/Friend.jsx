import "./Friend.css";
import { Link, useNavigate } from "react-router";
import useFetch from "../../hooks/useFetch";
import { isLogedIn } from "../../session/sessionManager";
import Avatar from "../parts/Avatar";

export default function Friend({ user, isFriendProp }) {
  const { loading, success, makeRequest } = useFetch();
  const navigate = useNavigate();
  const isFriend = user.isFriend ?? isFriendProp;

  function onMessageClick(user) {
    navigate("/messages", {
      state: { currentChat: { id: user.id, name: user.name } },
    });
  }

  function onAcceptClick() {
    makeRequest(`/users/${user.id}/accept-request`, "POST");
  }

  function onRejectClick() {
    if (
      confirm(`Are you sure you want to reject ${user.name} friend request?`)
    ) {
      makeRequest(`/users/${user.id}/reject-request`, "DELETE");
    }
  }

  function onCancelClick() {
    makeRequest(`/users/${user.id}/cancel-request`, "DELETE");
  }

  function onSendRequestClick() {
    makeRequest(`/users/${user.id}/send-request`, "POST");
  }

  return (
    <div className="user-item">
      <Avatar data={user} size={6} />
      <div className="user-info">
        <div className="name">
          <Link to={`/profile/${user.id}`}>{user.name}</Link>
        </div>
        {isLogedIn() && (
          <div className="buttons">
            {user.requestReceived ? (
              <>
                <button
                  className="button"
                  disabled={loading || success}
                  onClick={onAcceptClick}
                >
                  {success ? "Accepted" : "Accept"}
                </button>
                <button
                  className="button"
                  disabled={loading || success}
                  onClick={onRejectClick}
                >
                  {success ? "Rejected" : "Reject"}
                </button>
              </>
            ) : user.requestSent ? (
              <button
                className="button"
                disabled={loading || success}
                onClick={onCancelClick}
              >
                {success ? "Canceled" : "Cancel Request"}
              </button>
            ) : isFriend ? (
              <button
                className="button"
                onClick={() => {
                  onMessageClick(user);
                }}
              >
                Message
              </button>
            ) : (
              (user.isMyself === false ||
                typeof user.isMyself === "undefined") && (
                <button
                  className="button"
                  disabled={loading || success}
                  onClick={onSendRequestClick}
                >
                  {success ? "Request sended" : "Send friend request"}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
