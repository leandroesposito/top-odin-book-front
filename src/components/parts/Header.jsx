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
import { useEffect, useState } from "react";
import Loading from "./Loading/Loading";
import { Moon, Sun } from "lucide-react";

function Header() {
  function displayDarkMode(state) {
    if (state) {
      document.querySelector("body").classList.add("dark-mode");
      localStorage.setItem("dark-mode", "1");
    } else {
      document.querySelector("body").classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "");
    }
  }

  function getSystemDarkMode() {
    const storageMode = localStorage.getItem("dark-mode");
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    let value = false;

    if (storageMode !== null) {
      value = Boolean(storageMode);
    } else if (mq.matches) {
      value = true;
    }

    displayDarkMode(value);
    return value;
  }

  const [isDarkMode, setIsDarkMode] = useState(getSystemDarkMode);
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

  function onDarkmodeChange(event) {
    const target = event.target;
    const checked = target.checked;
    setIsDarkMode(checked);
    displayDarkMode(checked);
  }

  return (
    <header className={`header ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="left">
        <div className="logo">
          <Link to={"/"}>
            <h1>ODIN BOOK</h1>
          </Link>
        </div>
      </div>
      <div className="right">
        <div className="buttons">
          <label htmlFor="dark-mode-switch" className="dark-mode-switch-label">
            <input
              type="checkbox"
              name="dark-mode-switch"
              id="dark-mode-switch"
              onChange={onDarkmodeChange}
              checked={isDarkMode}
              aria-label="Color theme switch"
            />
            <div className="dark-mode-icon">
              {isDarkMode ? <Moon /> : <Sun />}
            </div>
          </label>
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
