import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../api/axios";
import "../styles/Auth.css";

function Register() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/register",
        {
          username,
          email,
          password,
        }
      );

      toast.success("Registration Successful");
      navigate("/login");

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
                Build Your
                <br />
                Personal
                <br />
                Movie Space
              </h1>

              <p>
                Create collections, follow other users, save favorites, and discover better recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <form
            className="auth-form"
            onSubmit={handleRegister}
          >
            <h1>Create Account</h1>

            <p className="auth-subtitle">
              Register to start watching smarter
            </p>

            <div className="auth-input">
              <span>U</span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />
            </div>

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
              Register
            </button>

            <p className="auth-note">
              Already have account?
              <Link to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
