import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Loading from "../parts/Loading/Loading";
import FlashMessages from "../parts/FlashMessage/FlashMessages";
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
        <FlashMessages errors={errors} />
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
                {Array.isArray(data?.suggestedUsers) &&
                  data.suggestedUsers.map((user) => {
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
