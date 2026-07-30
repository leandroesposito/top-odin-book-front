import { useCallback, useState } from "react";

const domain = "http://localhost:3000/api";

function useFetch() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState([]);

  const reset = useCallback(() => {
    setLoading(false);
    setData(null);
    setSuccess(null);
    setErrors([]);
  }, []);

  const makeRequest = useCallback(async function makeRequest(
    route,
    method = "GET",
    body = null,
  ) {
    setLoading(true);
    const options = {
      method,
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const endpoint = domain + route;
      const response = await fetch(endpoint, options);
      const json = await response.json();

      const { ...newData } = json;

      if (json.errors) {
        setErrors((errors) => [...errors, ...json.errors]);
      }
      if (typeof json.success !== "undefined") {
        setSuccess(json.success);
      }
      if (Object.keys(newData).length > 0) {
        setData(newData);
      }

      return setLoading(false);
    } catch (error) {
      console.error("FETCH ERROR", error);
      console.error("while fetching", { route, method, body });
      setErrors((errors) => [...errors, error.message]);
      return setLoading(false);
    }
  }, []);

  return { loading, data, success, errors, makeRequest, reset };
}

export default useFetch;
