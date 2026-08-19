import "./Sidebar.css";
import { Link, useLocation } from "react-router";
import { isLogedIn } from "../../session/sessionManager";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (location.pathname === "/messages") {
    return null;
  }

  return (
    <aside>
      <div className={"menu"}>
        <div className="menu-header">
          <button
            className="button round collapse-menu-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu aria-label="Menu" />
          </button>
          <h2>Menu</h2>
        </div>
        <nav className={`${isCollapsed === true ? "menu-collapsed" : ""}`}>
          <ul className="menu-items">
            {isLogedIn() && (
              <>
                <li className="item">
                  <Link to={`/friends`}>
                    <span className="menu-link">Friends</span>
                  </Link>
                </li>
                <li className="item">
                  <Link to={"/friends-requests"}>
                    <span className="menu-link">Friends Requests</span>
                  </Link>
                </li>
                <li className="item">
                  <Link to={"/suggested"}>
                    <span className="menu-link">Suggested</span>
                  </Link>
                </li>
              </>
            )}
            <li className="item">
              <Link to={"/search"}>
                <span className="menu-link">Search</span>
              </Link>
            </li>
            {isLogedIn() && (
              <>
                <li className="item">
                  <Link to={"/messages"}>
                    <span className="menu-link">Messages</span>
                  </Link>
                </li>
                <li className="item">
                  <Link to={"/log-out"}>
                    <span className="menu-link">Log out</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
