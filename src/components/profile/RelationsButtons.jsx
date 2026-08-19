import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import FlashMessages from "../parts/FlashMessage/FlashMessages";

function RelationsButtons({ profile, onButtonClick }) {
  const { loading, success, data, errors, makeRequest } = useFetch();

  useEffect(() => {
    if (success) {
      onButtonClick();
    }
  }, [data, success, onButtonClick]);

  function sendFriendRequest() {
    makeRequest(`/users/${profile.userId}/send-request`, "POST");
  }

  function acceptFriendRequest() {
    makeRequest(`/users/${profile.userId}/accept-request`, "POST");
  }

  function rejectFriendRequest() {
    if (
      confirm(
        `Are you sure you want to reject ${profile.name} friends request?`,
      )
    ) {
      makeRequest(`/users/${profile.userId}/reject-request`, "DELETE");
    }
  }

  function cancelFriendRequest() {
    makeRequest(`/users/${profile.userId}/cancel-request`, "DELETE");
  }

  function deleteFriend() {
    if (
      confirm(
        `Are you sure you want to delete ${profile.name} from you friends list?`,
      )
    ) {
      makeRequest(`/friends/${profile.userId}`, "DELETE");
    }
  }

  if (!profile) {
    return null;
  }

  const { isFriend, requestSent, requestReceived } = profile;

  return (
    <>
      {isFriend !== null && isFriend ? (
        <button
          disabled={loading}
          onClick={deleteFriend}
          className="delete-friend"
        >
          Delete friend
        </button>
      ) : requestReceived ? (
        <>
          <button
            disabled={loading}
            onClick={acceptFriendRequest}
            className="accept-request"
          >
            Accept request
          </button>
          <button
            disabled={loading}
            onClick={rejectFriendRequest}
            className="reject-request"
          >
            Reject request
          </button>
        </>
      ) : requestSent ? (
        <button
          disabled={loading}
          onClick={cancelFriendRequest}
          className="cancel-request"
        >
          Cancel request
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={sendFriendRequest}
          className="send-friend-request"
        >
          Send friend request
        </button>
      )}
      <FlashMessages errors={errors} />
    </>
  );
}
export default RelationsButtons;
