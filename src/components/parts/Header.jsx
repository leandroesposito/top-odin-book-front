import { Link } from "react-router";
import {
  getName,
  getUser,
  getUserId,
  isLogedIn,
  logIn,
} from "../../session/sessionManager";
import "./Header.css";
import Avatar from "./Avatar";
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
              <Link to={`/profile/${getUserId()}`} className="button">
                <Avatar data={getUser()} addAnchor={false} />
                {getName()}
              </Link>
              <Link to={"/log-out"} className="button">
                Log out
              </Link>
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
