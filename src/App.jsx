import { Navigate, Outlet, useLocation } from "react-router";
import "./App.css";
import Header from "./components/parts/Header";
import { isLogedIn } from "./session/sessionManager";
import Sidebar from "./components/parts/Sidebar";

function App() {
  const location = useLocation();

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
