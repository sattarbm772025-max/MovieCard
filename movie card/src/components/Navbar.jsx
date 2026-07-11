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
          <span className="nav-icon">⌂</span>
          Home
        </Link>

        {token && (
          <>
            <Link to="/dashboard">
              <span className="nav-icon">▦</span>
              Dashboard
            </Link>

            <Link to="/favorites">
              <span className="nav-icon">♡</span>
              Favorites
            </Link>

            <Link to="/watchlist">
              <span className="nav-icon">▤</span>
              Watchlist
            </Link>

            <Link to="/watched">
              <span className="nav-icon">✓</span>
              Watched
            </Link>

            <Link to="/collections">
              <span className="nav-icon">□</span>
              Collections
            </Link>

            <Link to="/collections/public">
              <span className="nav-icon">◇</span>
              Public
            </Link>

            <Link to="/compare">
              <span className="nav-icon">⇄</span>
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
              <span className="nav-icon">○</span>
              Profile
            </Link>

            {isAdmin && (
              <Link to="/admin">
                <span className="nav-icon">⚙</span>
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
