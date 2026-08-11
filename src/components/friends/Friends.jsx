import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Loading from "../parts/Loading/Loading";
import FlashMessage from "../parts/FlashMessage/FlashMessage";
import Friend from "./Friend";
import { Link } from "react-router";

export default function Friends({ userId }) {
  const { loading, errors, data, makeRequest } = useFetch();

  useEffect(() => {
    makeRequest(`/friends/${userId ?? ""}`);
  }, [makeRequest, userId]);

  return (
    <>
      <Link to={"/friends-requests"}>Friends requests</Link>
      {!loading && !data && errors.length == 0 ? null : loading ? (
        <Loading />
      ) : !data && errors.length > 0 ? (
        <div className="flash-messages">
          {errors.map((error, index) => (
            <FlashMessage message={error} type={"error"} key={index} />
          ))}
        </div>
      ) : (
        <div className="friends">
          {Array.isArray(data?.friends) &&
            data.friends.map((user) => {
              return <Friend user={user} key={user.id} />;
            })}
        </div>
      )}
    </>
  );
}
