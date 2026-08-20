import "./PostForm.css";
import "../parts/form.css";
import FormRow from "../parts/FormRow";
import Loading from "../parts/Loading/Loading";
import FlashMessages from "../parts/FlashMessage/FlashMessages";
import { setValidationResult } from "../parts/FormValidation";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { Navigate, useNavigate, useParams } from "react-router";
import { isLogedIn } from "../../session/sessionManager";
import { CircleX, Images } from "lucide-react";

function PostForm() {
  const { loading, data, success, errors, makeRequest } = useFetch();
  const [body, setBody] = useState("");
  const [pictures, setPictures] = useState(null);
  const [picturesToUpload, setPicturesToUpload] = useState([]);
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    let redirectTimeout = null;
    if (success && data.message) {
      redirectTimeout = setTimeout(() => {
        navigate(`/post/${postId || data.post?.id}`);
      }, 10);
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [data, success, postId, navigate]);

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
    const bodyElem = document.querySelector("textarea#body.post-body");
    const picturesInput = getPicturesInput();

    if (bodyElem.value.length > 500) {
      bodyElem.setCustomValidity(
        "Message must be between 0 and 500 characters inclusive.",
      );
      return false;
    } else {
      bodyElem.setCustomValidity("");
    }

    if (bodyElem.value.trim() === "" && picturesInput.files.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  function getPicturesInput() {
    return document.querySelector("input#pictures.post-pictures");
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
    setPicturesToUpload(files);
    return true;
  }

  function clearFileInput() {
    const input = getPicturesInput();
    input.value = "";
    setPicturesToUpload([]);
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
      <div className="form-container post-form-container">
        <form
          onSubmit={onSubmit}
          className="form"
          encType="multipart/form-data"
        >
          <h2>{typeof postId === "undefined" && "New "} Post</h2>
          <div className="form-row-content body-row">
            <label htmlFor="body">What are you thinking?</label>
            <textarea
              className="post-body"
              type="text"
              name="body"
              id="body"
              onChange={validateBody}
              onBlur={validateBody}
              maxLength={500}
              defaultValue={body}
              rows={4}
            />
          </div>
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
            <label htmlFor="pictures" className="file-input-label-button">
              <Images /> Select Pictures
              <input
                className="post-pictures"
                type="file"
                name="pictures"
                id="pictures"
                onChange={validatePictures}
                accept="image/*"
                multiple
              />
            </label>
            {picturesToUpload.length > 0 && (
              <>
                <div className="pictures-to-upload">
                  {[...picturesToUpload].map((p) => {
                    return (
                      <div className="picture-item" key={p.name}>
                        {p.name}
                      </div>
                    );
                  })}
                </div>
                <button
                  className="button clear-files-button"
                  type="button"
                  onClick={clearFileInput}
                >
                  <CircleX /> Clear Files
                </button>
              </>
            )}
          </FormRow>
          <div className="buttons">
            <button
              type="submit"
              className="button"
              onClick={onSubmitClick}
              disabled={loading}
            >
              Submit
            </button>
          </div>
          {loading && <Loading size={4} />}
        </form>
        <FlashMessages data={data} errors={errors} />
      </div>
    </>
  );
}

export default PostForm;
