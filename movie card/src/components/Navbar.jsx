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

import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const {
    token,
    logout,
  } = useContext(AuthContext);

  const [darkMode, setDarkMode] =
    useState(true);

  const favoriteCount =
    JSON.parse(
      localStorage.getItem("favorites")
    )?.length || 0;

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
        🎬 Movie App
      </div>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        {token && (
          <>
            <Link to="/favorites">
              Favorites ({favoriteCount})
            </Link>

            <Link to="/watchlist">
              Watchlist
            </Link>

            <Link to="/profile">
              Profile
            </Link>
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
          {darkMode ? "☀️" : "🌙"}
        </button>

      </div>

    </nav>
  );
}

export default Navbar;