import {
  useState,
  useContext,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  AuthContext,
} from "../context/AuthContext";

import API from "../api/axios";
import "../styles/Auth.css";

function Login() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response =
        await API.post(
          "/login",
          {
            email,
            password,
          }
        );

      const data = response.data;

      localStorage.setItem(
        "token",
        data.access_token
      );

      localStorage.setItem(
        "user_id",
        data.user_id
      );

      localStorage.setItem(
        "is_admin",
        String(Boolean(data.is_admin))
      );

      login(
        data.access_token,
        data.is_admin
      );

      toast.success("Login Successful");
      navigate("/");

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Server Error"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-overlay">
            <div className="auth-logo">
              <span className="auth-logo-mark">
                M
              </span>
              MovieCard
            </div>

            <div>
              <h1>
                Find Your
                <br />
                Next Favorite
                <br />
                Movie
              </h1>

              <p>
                Personalized recommendations based on your searches, favorites, reviews, and watchlist.
              </p>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <form
            className="auth-form"
            onSubmit={handleLogin}
          >
            <h1>Welcome Back!</h1>

            <p className="auth-subtitle">
              Login to continue
            </p>

            <div className="auth-input">
              <span>@</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="auth-input">
              <span>*</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button type="submit">
              Login
            </button>

            <p className="auth-note">
              No account?
              <Link to="/register">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
