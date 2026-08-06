import FormRow from "../../parts/FormRow";
import Loading from "../../parts/Loading/Loading";
import FlashMessage from "../../parts/FlashMessage/FlashMessage";
import { setValidationResult } from "../../parts/FormValidation";
import { useEffect } from "react";
import useFetch from "../../../hooks/useFetch";
import { isLogedIn } from "../../../session/sessionManager";

function CommentForm({ postId, onNewComment }) {
  const { loading, data, success, errors, makeRequest } = useFetch();

  function clearBody() {
    document.querySelector("textarea#body").value = "";
  }

  useEffect(() => {
    if (success && data.message) {
      setTimeout(() => {
        onNewComment();
        clearBody();
      });
    }
  }, [data, success, onNewComment]);

  function validateBody() {
    const input = document.querySelector("textarea#body");
    if (input.value.trim() === "") {
      return false;
    } else if (input.validity.tooLong) {
      setValidationResult(
        input,
        "Message can't be longer than 250 characters.",
      );
    } else {
      setValidationResult(input, "");
      return true;
    }

    return false;
  }

  function onSubmitClick() {
    validateBody();
  }

  function onSubmit(event) {
    event.preventDefault();

    const validBody = validateBody();

    if (!validBody) {
      return false;
    }

    const formData = new FormData(event.target);

    makeRequest(`/posts/${postId}/comments`, "POST", formData);
  }

  if (!isLogedIn()) {
    return null;
  }

  return (
    <>
      <div className="form-container">
        <form onSubmit={onSubmit} className="form">
          <FormRow>
            <textarea
              type="text"
              name="body"
              id="body"
              maxLength={250}
              rows={15}
              required
              aria-label="New Comment"
              placeholder="New Comment"
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
        </div>
      </div>
    </>
  );
}

export default CommentForm;
