import { useEffect, useRef, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import FlashMessage from "../../parts/FlashMessage/FlashMessage";
import "./NewMessageForm.css";

export default function NewMessageForm({ currentChat }) {
  const [body, setBody] = useState("");
  const [imagesCount, setImagesCount] = useState(0);
  const { loading, errors, makeRequest, reset } = useFetch();
  const messageInputRef = useRef();

  function onBodyChange(event) {
    const bodyElem = event.target;
    setBody(bodyElem.value);
  }

  function validateBody() {
    const bodyElem = document.querySelector("textarea#body");
    const picturesInput = getPicturesInput();

    if (bodyElem.value.length > 250) {
      bodyElem.setCustomValidity(
        "Message must be between 0 and 250 characters inclusive.",
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
    return document.querySelector("input#pictures");
  }

  function validatePictures() {
    const MAX_FILE_SIZE = 1024 * 512; // 512 KB
    const input = getPicturesInput();
    const files = input.files;

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        input.setCustomValidity("File can't be larger than 512 KB.");
        return false;
      }
    }

    input.setCustomValidity("");
    return true;
  }

  function clearFileInput() {
    const input = getPicturesInput();
    input.value = "";
    onPicturesChange();
  }

  function onPicturesChange() {
    validatePictures();
    const input = getPicturesInput();
    setImagesCount(input.files.length);
  }

  function onSubmitClick() {
    validateBody();
    validatePictures();
  }

  function onSubmit(event) {
    event.preventDefault();

    const validBody = validateBody();
    const validPictures = validatePictures();

    if (!validBody || !validPictures) {
      return false;
    }

    const formData = new FormData(event.target.closest("form"));

    makeRequest(`/messages/user/${currentChat.id}`, "POST", formData, true);
    setBody("");
    clearFileInput();
  }

  function handleKeyDown(event) {
    if (event.keyCode == 13 && !(event.shiftKey || event.ctrlKey)) {
      onSubmit(event);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      messageInputRef.current.focus();
    });
    reset();
  }, [currentChat, reset]);

  return (
    <div className="new-message-form-container">
      <div className="flash-messages">
        {errors.map((error, index) => (
          <FlashMessage message={error} type={"error"} key={index} />
        ))}
      </div>
      <form
        onSubmit={onSubmit}
        className="mew-message-form"
        encType="multipart/form-data"
      >
        <textarea
          aria-label="message"
          type="text"
          name="body"
          id="body"
          onChange={onBodyChange}
          onKeyDown={handleKeyDown}
          onBlur={validateBody}
          maxLength={250}
          rows={1}
          value={body}
          ref={messageInputRef}
        ></textarea>
        <pre className="sizer">{body}</pre>
        <div className="buttons">
          <div className="image-selector">
            {imagesCount > 0 && (
              <div className="files-count">{imagesCount}</div>
            )}
            <input
              type="file"
              name="pictures"
              id="pictures"
              onChange={onPicturesChange}
              accept="image/*"
              multiple
            />
            {imagesCount > 0 && (
              <button type="button" onClick={clearFileInput}>
                X
              </button>
            )}
          </div>
          <button
            type="submit"
            className="round"
            onClick={onSubmitClick}
            disabled={loading}
            aria-label="Send"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
