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

import "../styles/Auth.css";

function Login() {

  const navigate =
    useNavigate();

  const { login } =
    useContext(AuthContext);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response =
        await fetch(
          "http://127.0.0.1:8000/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              email,
              password
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        toast.error(
          data.detail ||
          "Login Failed"
        );

        return;
      }

      localStorage.setItem(
        "token",
        data.access_token
      );

      login(
        data.access_token
      );

      toast.success(
        "Login Successful"
      );

      navigate("/");

    } catch (error) {

      toast.error(
        "Server Error"
      );
    }
  };

  return (
    <div className="auth-container">

      <form
        className="auth-form"
        onSubmit={handleLogin}
      >

        <h1>Login</h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <button type="submit">
          Login
        </button>

        <p>

          No account?

          <Link to="/register">
            Register
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;