import { Navigate, Outlet, useLocation } from "react-router";
import "./App.css";
import Header from "./components/parts/Header";
import { isLogedIn } from "./session/sessionManager";
import Sidebar from "./components/parts/Sidebar";
import useFetch from "./hooks/useFetch";
import { useEffect } from "react";

function App() {
  const { makeRequest } = useFetch();
  const location = useLocation();

  // used to wake up the free server only on free version
  useEffect(() => {
    makeRequest("/");
  }, []);

  if (location.pathname === "/") {
    if (isLogedIn()) {
      return <Navigate to={"/feed"} />;
    } else {
      return <Navigate to={"/log-in"} />;
    }
  }

  return (
    <>
      <Header />
      <div className="body">
        <Sidebar />
        <div className="main">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
