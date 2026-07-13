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

const icons = {
  profile: "\uD83D\uDC64",
  home: "\uD83C\uDFE0",
  search: "\uD83D\uDD0E",
  favorite: "\u2764\uFE0F",
  watchlist: "\uD83D\uDCCB",
  dashboard: "\uD83D\uDCCA",
  watched: "\u2705",
  collections: "\uD83C\uDF9E\uFE0F",
  public: "\uD83C\uDF10",
  compare: "\u2696\uFE0F",
  alerts: "\uD83D\uDD14",
  admin: "\u2699\uFE0F",
  light: "\u2600\uFE0F",
  dark: "\uD83C\uDF19",
};

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

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const themeIcon =
    darkMode ? icons.light : icons.dark;

  return (
    <nav className="navbar">
      <div className="mobile-topbar">
        <div className="mobile-left-actions">
          <button
            type="button"
            className="mobile-profile-btn"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-label="Open menu"
          >
            {icons.profile}
          </button>

          <a
            href="#search"
            className="mobile-quick-link"
            aria-label="Search"
            onClick={closeMenu}
          >
            {icons.search}
          </a>
        </div>

        <div className="mobile-quick-links right">
          <NavLink
            to="/"
            end
            className="mobile-quick-link"
            aria-label="Home"
            onClick={closeMenu}
          >
            {icons.home}
          </NavLink>

          {token && (
            <>
              <NavLink
                to="/favorites"
                className="mobile-quick-link"
                aria-label="Favorites"
                onClick={closeMenu}
              >
                {icons.favorite}
              </NavLink>

              <NavLink
                to="/watchlist"
                className="mobile-quick-link"
                aria-label="Watchlist"
                onClick={closeMenu}
              >
                {icons.watchlist}
              </NavLink>
            </>
          )}

          <button
            type="button"
            className="mobile-quick-link"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {themeIcon}
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
          <span className="nav-icon">{icons.home}</span>
          Home
        </NavLink>

        {token && (
          <>
            <NavLink
              to="/dashboard"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">{icons.dashboard}</span>
              Dashboard
            </NavLink>

            <NavLink
              to="/favorites"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">{icons.favorite}</span>
              Favorites
            </NavLink>

            <NavLink
              to="/watchlist"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">{icons.watchlist}</span>
              Watchlist
            </NavLink>

            <NavLink
              to="/watched"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">{icons.watched}</span>
              Watched
            </NavLink>

            <NavLink
              to="/collections"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">{icons.collections}</span>
              Collections
            </NavLink>

            <NavLink
              to="/collections/public"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">{icons.public}</span>
              Public
            </NavLink>

            <NavLink
              to="/compare"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="nav-icon">{icons.compare}</span>
              Compare
            </NavLink>

            <NavLink
              to="/notifications"
              className={navClass}
              onClick={closeMenu}
            >
              <span className="alert-link">
                <span className="nav-icon">{icons.alerts}</span>
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
              <span className="nav-icon">{icons.profile}</span>
              Profile
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={navClass}
                onClick={closeMenu}
              >
                <span className="nav-icon">{icons.admin}</span>
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
          aria-label="Toggle theme"
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {themeIcon}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
