import "./SignUpBody.css";
import FormRow from "../parts/FormRow";
import Loading from "../parts/Loading/Loading";
import Required from "../parts/Required";
import FlashMessage from "../parts/FlashMessage/FlashMessage";
import { setValidationResult } from "../parts/FormValidation";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router";

function SignUpBody() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading, data, success, errors, makeRequest } = useFetch();
  const [viewPassword, setViewPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let redirectTimeout = null;
    if (success) {
      redirectTimeout = setTimeout(() => {
        navigate("/log-in");
      }, 3000);
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [success, navigate]);

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
    } else if (usernameElem.validity.tooShort) {
      setValidationResult(
        usernameElem,
        "Username must be at least 4 characters.",
      );
    } else if (usernameElem.validity.tooLong) {
      setValidationResult(
        usernameElem,
        "Username can't be longer than 10 characters.",
      );
    } else if (usernameElem.validity.patternMismatch) {
      setValidationResult(
        usernameElem,
        "Username can only have lowercase letters, numbers, dots (.) and underscores (_).",
      );
    } else {
      setValidationResult(usernameElem, "");
      return true;
    }

    return false;
  }

  function updatePasswordRequirements(password) {
    const requirementLength = document.querySelector(".requirement-length");
    const requirementLowercase = document.querySelector(
      ".requirement-lowercase",
    );
    const requirementUppercase = document.querySelector(
      ".requirement-uppercase",
    );
    const requirementNumber = document.querySelector(".requirement-number");
    const requirementSymbol = document.querySelector(".requirement-symbol");

    requirementLength.classList.remove("invalid", "valid");
    requirementLowercase.classList.remove("invalid", "valid");
    requirementUppercase.classList.remove("invalid", "valid");
    requirementNumber.classList.remove("invalid", "valid");
    requirementSymbol.classList.remove("invalid", "valid");

    if (/.{8,}/.test(password)) {
      requirementLength.classList.add("valid");
    } else {
      requirementLength.classList.add("invalid");
    }
    if (/[a-z]/.test(password)) {
      requirementLowercase.classList.add("valid");
    } else {
      requirementLowercase.classList.add("invalid");
    }
    if (/[A-Z]/.test(password)) {
      requirementUppercase.classList.add("valid");
    } else {
      requirementUppercase.classList.add("invalid");
    }
    if (/\d/.test(password)) {
      requirementNumber.classList.add("valid");
    } else {
      requirementNumber.classList.add("invalid");
    }
    if (/[^a-zA-Z0-9]/.test(password)) {
      requirementSymbol.classList.add("valid");
    } else {
      requirementSymbol.classList.add("invalid");
    }
  }

  function onPasswordChange(event) {
    const passwordElem = event.target;
    const newPassword = passwordElem.value;
    setPassword(newPassword);

    updatePasswordRequirements(newPassword);
    validatePassword(event);
  }

  function validatePassword() {
    const passwordElem = document.querySelector("input#password");

    if (passwordElem.validity.valueMissing) {
      setValidationResult(passwordElem, "Password is required.");
    } else if (passwordElem.validity.tooShort) {
      setValidationResult(
        passwordElem,
        "Password must be at least 8 characters.",
      );
    } else if (passwordElem.validity.patternMismatch) {
      setValidationResult(
        passwordElem,
        "Password doesn't meet the requirements.",
      );
    } else {
      setValidationResult(passwordElem, "");
      return true;
    }

    return false;
  }

  function onConfirmpasswordChange(event) {
    const confirmPasswordElem = event.target;
    const newConfirmPassword = confirmPasswordElem.value;
    setConfirmPassword(newConfirmPassword);

    validateConfirmPassword(newConfirmPassword);
  }

  function onConfirmPasswordFocusOut() {
    validateConfirmPassword();
  }

  function validateConfirmPassword(newConfirmPassword = null) {
    const confirmPasswordElem = document.querySelector("#confirm-password");

    if (password != (newConfirmPassword || confirmPassword)) {
      setValidationResult(
        confirmPasswordElem,
        "Password and Confirm password don't match.",
      );
    } else {
      setValidationResult(confirmPasswordElem, "");
      return true;
    }

    return false;
  }

  function onSubmitClick() {
    validateUsername();
    validatePassword();
    validateConfirmPassword();
  }

  function onSubmit(event) {
    event.preventDefault();

    if (data && data.success) {
      // prevent submit when data already submited
      return;
    }

    const validUsername = validateUsername();
    const validPassword = validatePassword();
    const validConfirmPassword = validateConfirmPassword();

    if (!validUsername || !validPassword || !validConfirmPassword) {
      return false;
    }

    const formData = new FormData(event.target);

    makeRequest("/auth/sign-up", "POST", Object.fromEntries(formData));
  }

  function onPasswordVisibilityClick() {
    setViewPassword(!viewPassword);
  }

  return (
    <>
      <div className="body">
        <div className="form-container">
          <form onSubmit={onSubmit} className="auth-form form">
            <h2>Sign Up</h2>
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
                minLength={4}
                maxLength={20}
                pattern="[a-z0-9_.]+"
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
                minLength={8}
                pattern="(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[^a-zA-Z0-9]).{8,}"
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
            <div className="password-requirements">
              <div>Password must contain at least:</div>
              <div className="password-requirement requirement-length">
                8 (eight) characters.
              </div>
              <div className="password-requirement requirement-lowercase">
                One (1) lowercase letter.
              </div>
              <div className="password-requirement requirement-uppercase">
                One (1) uppercase letter.
              </div>
              <div className="password-requirement requirement-number">
                One (1) number.
              </div>
              <div className="password-requirement requirement-symbol">
                One (1) symbol, ex ( - . $ # @ ! ? ).
              </div>
            </div>
            <FormRow>
              <label htmlFor="confirm-password">
                Confirm password <Required />
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                value={confirmPassword}
                onChange={onConfirmpasswordChange}
                onBlur={onConfirmPasswordFocusOut}
                required
              />
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
            {data !== null && data.message !== null && (
              <FlashMessage message={data.message} type={"success"} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpBody;
