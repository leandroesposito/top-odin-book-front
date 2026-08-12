import { Navigate, Outlet, useLocation } from "react-router";
import "./App.css";
import Header from "./components/parts/Header";
import { isLogedIn } from "./session/sessionManager";

function App() {
  const location = useLocation();

  if (location.pathname === "/") {
    console.log(location);
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
        <Outlet />
      </div>
    </>
  );
}

export default App;
