import { Outlet } from "react-router";
import "./App.css";
import Header from "./components/parts/header";

function App() {
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
