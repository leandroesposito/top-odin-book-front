import "./Sidebar.css";
import { Link, useLocation } from "react-router";
import { isLogedIn } from "../../session/sessionManager";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import useFetch from "../../hooks/useFetch";

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { data, makeRequest } = useFetch();

  useEffect(() => {
    if (isLogedIn && location.pathname !== "/messages") {
      makeRequest("/notifications");
      const interval = setInterval(() => {
        makeRequest("/notifications");
      }, 10000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [makeRequest, location.pathname]);

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
                    <div className="menu-link">
                      <div className="menu-link-content">
                        <div className="menu-link-caption">
                          Friends Requests
                        </div>
                        {data?.notifications?.friends_requests > 0 && (
                          <div className="unread-count">
                            {data?.notifications?.friends_requests}
                          </div>
                        )}
                      </div>
                    </div>
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
                    <div className="menu-link">
                      <div className="menu-link-content">
                        <div className="menu-link-caption">Messages</div>
                        {data?.notifications?.messages_unread_count > 0 && (
                          <div className="unread-count">
                            {data?.notifications?.messages_unread_count}
                          </div>
                        )}
                      </div>
                    </div>
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
