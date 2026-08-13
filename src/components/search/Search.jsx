import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Friend from "../friends/Friend";
import FlashMessage from "../parts/FlashMessage/FlashMessage";
import Loading from "../parts/Loading/Loading";

export default function Search() {
  const { loading, errors, data, makeRequest } = useFetch();
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputVal.trim().length >= 3) {
        makeRequest(`/users/search/${inputVal}`);
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputVal, makeRequest]);

  function onInputChange(event) {
    const searchParam = event.target.value;
    setInputVal(searchParam);
  }

  return (
    <>
      <h2 id="search-title">Search</h2>
      <input
        type="text"
        placeholder="search"
        aria-labelledby="search-title"
        onChange={onInputChange}
        value={inputVal}
      />

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
          <div className="results users-list">
            {Array.isArray(data?.foundUsers) &&
              data.foundUsers.length > 0 &&
              data.foundUsers.map((user) => {
                return <Friend user={user} key={user.id} />;
              })}
          </div>
        </>
      )}
    </>
  );
}
