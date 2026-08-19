import { Link } from "react-router";
import { getName, getUserId, isLogedIn } from "../../session/sessionManager";
import "./Header.css";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import Loading from "./Loading/Loading";

function Header() {
  const { loading, data, success, makeRequest } = useFetch();

  useEffect(() => {
    let redirectTimeout = null;
    if (data && data.user && success) {
      logIn(data.user);
      redirectTimeout = setTimeout(() => {
        window.location.reload();
      }, 100);
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [success, data]);

  function onGuestClick() {
    makeRequest("/auth/log-in/guest", "POST");
  }

  return (
    <header className="header">
      <div className="left">
        <div className="logo">
          <Link to={"/"}>
            <h1>ODIN BOOK</h1>
          </Link>
        </div>
      </div>
      <div className="right">
        <div className="buttons">
          {isLogedIn() ? (
            <>
              <div className="drop-down">
                <Link to={`/profile/${getUserId()}`}>{getName()}</Link>
                <div className="drop-down-items">
                  <Link to={`/friends`}>Friends</Link>
                  <Link to={"/friends-requests"}>Friends Requests</Link>
                  <Link to={"/suggested"}>Suggested</Link>
                  <Link to={"/search"}>Search</Link>
                  <Link to={"/messages"}>Messages</Link>
                  <Link to={"/log-out"}>Log out</Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to={"/log-in"} className="button">
                Log in
              </Link>
              <Link to={"/sign-up"} className="button">
                Sign up
              </Link>
              or
              <button
                className="button"
                type="button"
                onClick={onGuestClick}
                disabled={loading}
              >
                {loading ? <Loading size={1} /> : "Use guest account"}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
