//Suggested for you

import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Loading from "../parts/Loading/Loading";
import FlashMessages from "../parts/FlashMessage/FlashMessages";
import Friend from "./Friend";
import { Link, Navigate } from "react-router";
import { isLogedIn } from "../../session/sessionManager";

export default function Suggested() {
  const { loading, errors, data, makeRequest } = useFetch();

  useEffect(() => {
    makeRequest(`/friends/suggested`);
  }, [makeRequest]);

  if (!isLogedIn()) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <Link to={"/search"}>Or search</Link>
      {!loading && !data && errors.length == 0 ? null : loading ? (
        <Loading />
      ) : !data && errors.length > 0 ? (
        <FlashMessages errors={errors} />
      ) : (
        <>
          <h2>Suggested for you</h2>
          <div className="users-list">
            {Array.isArray(data?.suggestedUsers) &&
              data.suggestedUsers.length > 0 &&
              data.suggestedUsers.map((user) => {
                return (
                  <Friend user={user} key={user.id} isFriendProp={false} />
                );
              })}
          </div>
        </>
      )}
    </>
  );
}
