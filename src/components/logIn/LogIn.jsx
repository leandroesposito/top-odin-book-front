import FormRow from "../parts/FormRow";
import Loading from "../parts/Loading/Loading";
import Required from "../parts/Required";
import FlashMessage from "../parts/FlashMessage/FlashMessage";
import { setValidationResult } from "../parts/FormValidation";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { Navigate, useNavigate } from "react-router";
import { isLogedIn, logIn } from "../../session/sessionManager";

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, data, success, errors, makeRequest } = useFetch();
  const [viewPassword, setViewPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let redirectTimeout = null;
    if (data && data.user && success) {
      logIn(data.user);
      redirectTimeout = setTimeout(() => {
        window.location.reload();
      }, 3000);
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [success, data, navigate]);

  function onUsernameChange(event) {
    const usernameElem = event.target;
    if (usernameElem.value.includes(" ")) {
      // ignore space key
      return;
    }
    setUsername(usernameElem.value);

    validateUsername(event);
  }

  function validateUsername() {
    const usernameElem = document.querySelector("input#username");
    if (usernameElem.validity.valueMissing) {
      setValidationResult(usernameElem, "Username is required.");
    } else {
      setValidationResult(usernameElem, "");
      return true;
    }

    return false;
  }

  function onPasswordChange(event) {
    const passwordElem = event.target;
    setPassword(passwordElem.value);

    validatePassword(event);
  }

  function validatePassword() {
    const passwordElem = document.querySelector("input#password");

    if (passwordElem.validity.valueMissing) {
      setValidationResult(passwordElem, "Password is required.");
    } else {
      setValidationResult(passwordElem, "");
      return true;
    }

    return false;
  }

  function onSubmitClick() {
    validateUsername();
    validatePassword();
  }

  function onSubmit(event) {
    event.preventDefault();

    if (data && data.success) {
      // prevent submit when data already submited
      return;
    }

    const validUsername = validateUsername();
    const validPassword = validatePassword();

    if (!validUsername || !validPassword) {
      return false;
    }

    const formData = new FormData(event.target);

    makeRequest("/auth/log-in", "POST", Object.fromEntries(formData));
  }

  function onPasswordVisibilityClick() {
    setViewPassword(!viewPassword);
  }

  if (isLogedIn()) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="form-container">
        <form onSubmit={onSubmit} className="auth-form form">
          <h2>Log In</h2>
          <FormRow>
            <label htmlFor="username">
              Username <Required />
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={onUsernameChange}
              onBlur={validateUsername}
              required
            />
          </FormRow>
          <FormRow>
            <label htmlFor="password">
              Password <Required />
            </label>
            <input
              type={viewPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={onPasswordChange}
              onBlur={validatePassword}
              required
            />
            <button
              className="view-password"
              type="button"
              onClick={onPasswordVisibilityClick}
            >
              {viewPassword ? "hide" : "view"}
            </button>
          </FormRow>
          <div className="buttons">
            <button type="submit" onClick={onSubmitClick} disabled={loading}>
              Submit
            </button>
          </div>
          {loading && <Loading size={4} />}
        </form>
        <div className="flash-messages">
          {errors.map((error, index) => (
            <FlashMessage message={error} type={"error"} key={index} />
          ))}
          {data !== null && typeof data.message !== "undefined" && (
            <FlashMessage message={data.message} type={"success"} />
          )}
        </div>
      </div>
    </>
  );
}

export default LogIn;
