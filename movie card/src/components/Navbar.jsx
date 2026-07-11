import {
  NavLink,
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
      document.body.classList.add("light-mode");
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
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  };

  const handleLogout = () => {

    logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="logo">
        MovieCard
      </div>

      <div className="nav-links">
        <NavLink to="/" className={navClass}>
          <span className="nav-icon">H</span>
          Home
        </NavLink>

        {token && (
          <>
            <NavLink to="/dashboard" className={navClass}>
              <span className="nav-icon">D</span>
              Dashboard
            </NavLink>

            <NavLink to="/favorites" className={navClass}>
              <span className="nav-icon">F</span>
              Favorites
            </NavLink>

            <NavLink to="/watchlist" className={navClass}>
              <span className="nav-icon">W</span>
              Watchlist
            </NavLink>

            <NavLink to="/watched" className={navClass}>
              <span className="nav-icon">OK</span>
              Watched
            </NavLink>

            <NavLink to="/collections" className={navClass}>
              <span className="nav-icon">C</span>
              Collections
            </NavLink>

            <NavLink to="/collections/public" className={navClass}>
              <span className="nav-icon">P</span>
              Public
            </NavLink>

            <NavLink to="/compare" className={navClass}>
              <span className="nav-icon">VS</span>
              Compare
            </NavLink>

            <NavLink to="/notifications" className={navClass}>
              <span className="alert-link">
                <span className="nav-icon">N</span>
                Alerts
                {unreadCount > 0 && (
                  <span className="alert-badge">
                    {unreadCount}
                  </span>
                )}
              </span>
            </NavLink>

            <NavLink to="/profile" className={navClass}>
              <span className="nav-icon">U</span>
              Profile
            </NavLink>

            {isAdmin && (
              <NavLink to="/admin" className={navClass}>
                <span className="nav-icon">A</span>
                Admin
              </NavLink>
            )}
          </>
        )}

        {!token ? (
          <>
            <NavLink to="/login" className={navClass}>
              Login
            </NavLink>

            <NavLink to="/register" className={navClass}>
              Register
            </NavLink>
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
