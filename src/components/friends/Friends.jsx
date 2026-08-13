import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Loading from "../parts/Loading/Loading";
import FlashMessage from "../parts/FlashMessage/FlashMessage";
import Friend from "./Friend";
import { Link, Navigate, useParams } from "react-router";
import { getUserId, isLogedIn } from "../../session/sessionManager";

export default function Friends() {
  const { loading, errors, data, makeRequest } = useFetch();
  const { userId } = useParams();

  useEffect(() => {
    makeRequest(`/friends/${userId ?? ""}`);
  }, [makeRequest, userId]);

  if (!userId && !isLogedIn()) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      {isLogedIn() && !userId && (
        <Link to={"/friends-requests"}>Friends requests</Link>
      )}
      {!loading && !data && errors.length == 0 ? null : loading ? (
        <Loading />
      ) : !data && errors.length > 0 ? (
        <div className="flash-messages">
          {errors.map((error, index) => (
            <FlashMessage message={error} type={"error"} key={index} />
          ))}
        </div>
      ) : (
        <>
          <h2>
            {typeof data?.user !== "undefined"
              ? isLogedIn() && data.user.id === getUserId()
                ? "My "
                : `${data.user.name}'s `
              : ""}
            Friends
          </h2>
          <div className="friends">
            {Array.isArray(data?.friends) ? (
              data.friends.length > 0 ? (
                data.friends.map((user) => {
                  return <Friend user={user} key={user.id} />;
                })
              ) : (
                <>
                  <div>
                    Your friends list is empty, frind friends{" "}
                    <Link to={"/find"}>Here</Link>
                  </div>
                </>
              )
            ) : null}
          </div>
          {typeof userId === "undefined" && (
            <>
              <h2> Add more friends </h2>
              <div className="users-list">
                {Array.isArray(data?.notFriends) &&
                  data.notFriends.map((user) => {
                    return (
                      <Friend user={user} key={user.id} isFriend={false} />
                    );
                  })}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
