import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Loading from "../parts/Loading/Loading";
import FlashMessages from "../parts/FlashMessage/FlashMessages";
import { isLogedIn } from "../../session/sessionManager";
import Friend from "./Friend";

export default function FriendsRequests() {
  const { loading, errors, data, makeRequest } = useFetch();

  useEffect(() => {
    makeRequest("/users/me/friends-requests");
  }, [makeRequest]);

  if (!isLogedIn()) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <Link to={"/friends"}>Friends</Link>
      {!loading && !data && errors.length == 0 ? null : loading ? (
        <Loading />
      ) : !data && errors.length > 0 ? (
        <FlashMessages errors={errors} />
      ) : (
        <>
          <h2>Friend Requests</h2>
          {Array.isArray(data?.received) && data.received.length > 0 ? (
            <div className="friends-requests users-list">
              {data.received.map((user) => {
                return <Friend user={user} key={user.id} />;
              })}
            </div>
          ) : (
            <div>You don't have any friend request.</div>
          )}

          <h2>Sent Requests</h2>
          {Array.isArray(data?.sent) && data.sent.length > 0 ? (
            <div className="friends-requests users-list">
              {data.sent.map((user) => {
                return <Friend user={user} key={user.id} />;
              })}
            </div>
          ) : (
            <div>You don't have any pending request to be accepted.</div>
          )}
        </>
      )}
    </>
  );
}
