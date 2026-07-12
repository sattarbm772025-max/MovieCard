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

  const [menuOpen, setMenuOpen] =
    useState(false);

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

    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="mobile-topbar">
        <button
          type="button"
          className="mobile-profile-btn"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          aria-label="Open menu"
        >
          👤
        </button>

        <div className="mobile-quick-links">
          <NavLink
            to="/"
            end
            className="mobile-quick-link"
            aria-label="Home"
            onClick={closeMenu}
          >
            🏠
          </NavLink>
          <a
            href="#search"
            className="mobile-quick-link"
            aria-label="Search"
            onClick={closeMenu}
          >
            🔍
          </a>
        </div>

        <div className="mobile-quick-links right">
          {token && (
            <>
              <NavLink
                to="/favorites"
                className="mobile-quick-link"
                aria-label="Favorites"
                onClick={closeMenu}
              >
                ❤️
              </NavLink>
              <NavLink
                to="/watchlist"
                className="mobile-quick-link"
                aria-label="Watchlist"
                onClick={closeMenu}
              >
                📋
              </NavLink>
            </>
          )}
          <button
            type="button"
            className="mobile-quick-link"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div className="logo">
        MovieCard
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          end
          className={navClass}
          onClick={closeMenu}
        >
          <span className="nav-icon">🏠</span>
          Home
        </NavLink>

        {token && (
          <>
            <NavLink
              to="/dashboard"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </NavLink>

            <NavLink
              to="/favorites"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">❤️</span>
              Favorites
            </NavLink>

            <NavLink
              to="/watchlist"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">📋</span>
              Watchlist
            </NavLink>

            <NavLink
              to="/watched"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">✅</span>
              Watched
            </NavLink>

            <NavLink
              to="/collections"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">🎞️</span>
              Collections
            </NavLink>

            <NavLink
              to="/collections/public"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">🌐</span>
              Public
            </NavLink>

            <NavLink
              to="/compare"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">⚖️</span>
              Compare
            </NavLink>

            <NavLink
              to="/notifications"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="alert-link">
                <span className="nav-icon">🔔</span>
                Alerts
                {unreadCount > 0 && (
                  <span className="alert-badge">
                    {unreadCount}
                  </span>
                )}
              </span>
            </NavLink>

            <NavLink
              to="/profile"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">👤</span>
              Profile
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={navClass}
                onClick={closeMenu}
              >
                <span className="nav-icon">⚙️</span>
                Admin
              </NavLink>
            )}
          </>
        )}

        {!token ? (
          <>
            <NavLink
              to="/login"
              className={navClass}
              onClick={closeMenu}
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={navClass}
              onClick={closeMenu}
            >
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
          <span>{darkMode ? "☀️" : "🌙"}</span>
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
