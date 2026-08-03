import "./ProfileForm.css";
import FormRow from "../parts/FormRow";
import Loading from "../parts/Loading/Loading";
import FlashMessage from "../parts/FlashMessage/FlashMessage";
import { setValidationResult } from "../parts/FormValidation";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { Navigate } from "react-router";
import { getUserId, isLogedIn } from "../../session/sessionManager";

function ProfileForm() {
  const { loading, data, success, errors, makeRequest } = useFetch();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  useEffect(() => {
    let redirectTimeout = null;
    if (success) {
      redirectTimeout = setTimeout(() => {
        window.location.reload();
      }, 10);
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [success]);

  useEffect(() => {
    makeRequest(`/profiles/${getUserId()}`, "GET");
  }, [makeRequest]);

  useEffect(() => {
    if (data && data.profile) {
      setTimeout(() => {
        setName(data.profile.name);
        setBio(data.profile.bio);
        setProfession(data.profile.profession);
        setBirthdate(data.profile.birthdate);
        setProfilePictureUrl(data.profile.profilePictureUrl);
      });
    }
  }, [data]);

  function validateName() {
    const input = document.querySelector("input#name");
    return validateFieldLenght(input, "Name");
  }

  function validateBio() {
    const input = document.querySelector("textarea#bio");
    return validateFieldLenght(input, "Bio");
  }

  function validateProfession() {
    const input = document.querySelector("input#profession");
    return validateFieldLenght(input, "Profession");
  }

  function validateFieldLenght(inputElement, fieldName) {
    if (inputElement.validity.tooLong) {
      setValidationResult(
        inputElement,
        `${fieldName} can't be longer than ${inputElement.maxLength} characters.`,
      );
    } else {
      setValidationResult(inputElement, "");
      return true;
    }

    return false;
  }

  function getProfilePictureInput() {
    return document.querySelector("input#profile-picture");
  }

  function validateProfilePicture() {
    const MAX_FILE_SIZE = 1024 * 512; // 512 KB
    const input = getProfilePictureInput();
    const files = input.files;

    if (files.length == 0) {
      setValidationResult(input, "");
      return true;
    } else if (files.length > 1) {
      setValidationResult(input, "You can't select more than 1 (ONE) file.");
    } else if (files[0].size > MAX_FILE_SIZE) {
      setValidationResult(input, "File can't be larger than 512 KB.");
    } else {
      setValidationResult(input, "");
      return true;
    }
    return false;
  }

  function clearFileInput() {
    const input = getProfilePictureInput();
    input.value = "";
  }

  function onSubmitClick() {
    validateName();
    validateProfilePicture();
    validateBio();
    validateProfession();
  }

  function onSubmit(event) {
    event.preventDefault();

    if (data && data.success) {
      // prevent submit when data already submited
      return;
    }

    const validName = validateName();
    const validBio = validateBio();
    const validProfession = validateProfession();
    const validProfilePicture = validateProfilePicture();

    if (!validName || !validBio || !validProfession || !validProfilePicture) {
      return false;
    }

    const formData = new FormData(event.target);

    makeRequest("/profiles", "PUT", formData, true);
  }

  if (!isLogedIn()) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="form-container">
        <form
          onSubmit={onSubmit}
          className="form"
          encType="multipart/form-data"
        >
          <h2>My Profile</h2>
          <FormRow>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={validateName}
              onBlur={validateName}
              maxLength={50}
              defaultValue={name}
            />
          </FormRow>
          <FormRow>
            <label htmlFor="profile-picture">Profile picture</label>
            {profilePictureUrl !== "" && <img src={profilePictureUrl} />}
            <input
              type="file"
              name="profile-picture"
              id="profile-picture"
              onChange={validateProfilePicture}
              accept="image/*"
            />
            <button type="button" onClick={clearFileInput}>
              Clear
            </button>
          </FormRow>
          <FormRow>
            <label htmlFor="profession">Profession</label>
            <input
              type="text"
              name="profession"
              id="profession"
              onChange={validateProfession}
              onBlur={validateProfession}
              maxLength={20}
              defaultValue={profession}
            />
          </FormRow>
          <FormRow>
            <label htmlFor="bio">Bio</label>
            <textarea
              name="bio"
              id="bio"
              onChange={validateBio}
              onBlur={validateBio}
              maxLength={200}
              defaultValue={bio}
            ></textarea>
          </FormRow>
          <FormRow>
            <label htmlFor="bio">Bithdate</label>
            <input
              type="date"
              name="birthdate"
              id="birthdate"
              max={new Date().toISOString().split("T")[0]}
              defaultValue={birthdate.split("T")[0]}
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
          {data !== null && typeof data.message !== "undefined" && (
            <FlashMessage message={data.message} type={"success"} />
          )}
        </div>
      </div>
    </>
  );
}

export default ProfileForm;
