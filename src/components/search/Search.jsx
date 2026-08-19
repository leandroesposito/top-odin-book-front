import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Friend from "../friends/Friend";
import FlashMessages from "../parts/FlashMessage/FlashMessages";
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
      <label htmlFor="search">
        <h2 id="search-title">Search</h2>
      </label>
      <input
        type="text"
        placeholder="search"
        id="search"
        onChange={onInputChange}
        value={inputVal}
      />

      {!loading && !data && errors.length == 0 ? null : loading ? (
        <Loading />
      ) : !data && errors.length > 0 ? (
        <FlashMessages errors={errors} />
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
