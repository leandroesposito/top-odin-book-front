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
          aria-label=""
          disabled={loading}
          onClick={deleteFriend}
          className="delete-friend button"
        >
          Remove friend
        </button>
      ) : requestReceived ? (
        <>
          <button
            aria-label=""
            disabled={loading}
            onClick={acceptFriendRequest}
            className="accept-request button"
          >
            Accept request
          </button>
          <button
            aria-label=""
            disabled={loading}
            onClick={rejectFriendRequest}
            className="reject-request button"
          >
            Reject request
          </button>
        </>
      ) : requestSent ? (
        <button
          aria-label=""
          disabled={loading}
          onClick={cancelFriendRequest}
          className="cancel-request button"
        >
          Cancel request
        </button>
      ) : (
        <button
          aria-label=""
          disabled={loading}
          onClick={sendFriendRequest}
          className="send-friend-request button"
        >
          Send friend request
        </button>
      )}
      <FlashMessages errors={errors} />
    </>
  );
}
export default RelationsButtons;
