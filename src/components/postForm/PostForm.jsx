import "../parts/form.css";
import FormRow from "../parts/FormRow";
import Loading from "../parts/Loading/Loading";
import FlashMessage from "../parts/FlashMessage/FlashMessage";
import { setValidationResult } from "../parts/FormValidation";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { Navigate, useNavigate, useParams } from "react-router";
import { isLogedIn } from "../../session/sessionManager";
import Required from "../parts/Required";

function PostForm() {
  const { loading, data, success, errors, makeRequest } = useFetch();
  const [body, setBody] = useState("");
  const [pictures, setPictures] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    let redirectTimeout = null;
    if (success && data.message) {
      redirectTimeout = setTimeout(() => {
        window.location.reload();
      }, 10);
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [data, success, navigate]);

  useEffect(() => {
    if (postId) {
      makeRequest(`/posts/${postId}`, "GET");
    }
  }, [makeRequest, postId]);

  useEffect(() => {
    if (data && data.post) {
      setTimeout(() => {
        setBody(data.post.body);
        setPictures(data.post.pictures);
      });
    }
  }, [data]);

  function validateBody() {
    const input = document.querySelector("textarea#body");
    if (input.validity.valueMissing) {
      setValidationResult(input, "Message can't be empty.");
    } else if (input.validity.tooLong) {
      setValidationResult(
        input,
        "Message can't be longer than 500 characters.",
      );
    } else {
      setValidationResult(input, "");
      return true;
    }

    return false;
  }

  function getPicturesInput() {
    return document.querySelector("input#pictures");
  }

  function validatePictures() {
    const MAX_FILE_SIZE = 1024 * 512; // 512 KB
    const input = getPicturesInput();
    const files = input.files;

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setValidationResult(input, "File can't be larger than 512 KB.");
        return false;
      }
    }

    setValidationResult(input, "");
    return true;
  }

  function clearFileInput() {
    const input = getPicturesInput();
    input.value = "";
  }

  function onSubmitClick() {
    validateBody();
    validatePictures();
  }

  function onSubmit(event) {
    event.preventDefault();

    if (data && data.success && data.message) {
      // prevent submit when data already submited
      return;
    }

    const validBody = validateBody();
    const validPictures = validatePictures();

    if (!validBody || !validPictures) {
      return false;
    }

    const formData = new FormData(event.target);

    if (postId) {
      makeRequest(`/posts/${postId}`, "PUT", formData, true);
    } else {
      makeRequest("/posts", "POST", formData, true);
    }
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
          <h2>Post</h2>
          <FormRow>
            <label htmlFor="name">What are you thinking?</label> <Required />
            <textarea
              type="text"
              name="body"
              id="body"
              onChange={validateBody}
              onBlur={validateBody}
              maxLength={500}
              defaultValue={body}
              rows={15}
              required
            />
          </FormRow>
          {pictures !== null &&
            typeof pictures !== "undefined" &&
            pictures.length > 0 && (
              <div className="uploaded-pictures">
                {pictures.map((picture) => {
                  return (
                    <div className="uploaded-picture" key={picture.id}>
                      <img src={picture.url} />
                      <input
                        type="checkbox"
                        name="delete-pictures"
                        id={picture.id}
                        value={picture.id}
                      />
                      <label htmlFor={picture.id}>Delete</label>
                    </div>
                  );
                })}
              </div>
            )}
          <FormRow>
            <label htmlFor="pictures">Pictures</label>
            <input
              type="file"
              name="pictures"
              id="pictures"
              onChange={validatePictures}
              accept="image/*"
              multiple
            />
            <button type="button" onClick={clearFileInput}>
              Clear
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

export default PostForm;
