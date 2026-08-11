import { Link } from "react-router";
import useFetch from "../../hooks/useFetch";

export default function FriendRequest({ user, isReceived, isSent }) {
  const { loading, success, makeRequest } = useFetch();

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
        {isReceived ? (
          <>
            <button disabled={loading || success} onClick={onAcceptClick}>
              {success ? "Accepted" : "Accept"}
            </button>
            <button disabled={loading || success} onClick={onRejectClick}>
              {success ? "Rejected" : "Reject"}
            </button>
          </>
        ) : (
          isSent && (
            <button disabled={loading || success} onClick={onCancelClick}>
              {success ? "Canceled" : "Cancel Request"}
            </button>
          )
        )}
      </div>
    </div>
  );
}
