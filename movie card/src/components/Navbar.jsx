import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

import API from "../api/axios";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const {
    token,
    isAdmin,
    logout,
  } = useContext(AuthContext);

  const [darkMode, setDarkMode] =
    useState(true);

  const [unreadCount, setUnreadCount] =
    useState(0);

  useEffect(() => {

    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "light") {

      document.body.classList.add(
        "light-mode"
      );

      setDarkMode(false);
    }

  }, []);

  useEffect(() => {

    if (!token) {

      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {

      try {

        const response =
          await API.get(
            "/notifications/unread-count"
          );

        setUnreadCount(
          response.data.unread_count || 0
        );

      } catch {

        setUnreadCount(0);
      }
    };

    fetchUnreadCount();

    const intervalId = setInterval(
      fetchUnreadCount,
      30000
    );

    return () =>
      clearInterval(intervalId);

  }, [token]);

  const toggleTheme = () => {

    if (darkMode) {

      document.body.classList.add(
        "light-mode"
      );

      localStorage.setItem(
        "theme",
        "light"
      );

    } else {

      document.body.classList.remove(
        "light-mode"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    }

    setDarkMode(!darkMode);
  };

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="logo">
        MovieCard
      </div>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        {token && (
          <>
            <Link to="/favorites">
              Favorites
            </Link>

            <Link to="/watchlist">
              Watchlist
            </Link>

            <Link to="/collections">
              Collections
            </Link>

            <Link to="/compare">
              Compare
            </Link>

            <Link to="/notifications">
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                }}
              >
                Alerts

                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-14px",
                      minWidth: "18px",
                      height: "18px",
                      padding: "0 5px",
                      borderRadius: "999px",
                      background: "#ef4444",
                      color: "white",
                      fontSize: "12px",
                      lineHeight: "18px",
                      textAlign: "center",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </span>
            </Link>

            <Link to="/profile">
              Profile
            </Link>

            {isAdmin && (
              <Link to="/admin">
                Admin
              </Link>
            )}
          </>
        )}

        {!token ? (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        ) : (
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

        <button
          className="theme-btn"
          onClick={toggleTheme}
        >
          {darkMode ? "Light" : "Dark"}
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
