import Loading from "../parts/Loading/Loading";
import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router";
import { isLogedIn, logOut } from "../../session/sessionManager";

function LogOut() {
  const { success, makeRequest } = useFetch();
  const navigate = useNavigate();

  useEffect(() => {
    if (success != null) {
      logOut();
      window.location.reload();
    }
  }, [success, navigate]);

  useEffect(() => {
    if (!isLogedIn()) {
      navigate("/log-in");
    } else {
      makeRequest("/auth/log-out", "POST");
    }
  }, [makeRequest, navigate]);

  return (
    <>
      <Loading></Loading>
    </>
  );
}

export default LogOut;
