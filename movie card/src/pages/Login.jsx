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
        await API.post(
          "/login",
          {
            email,
            password,
          }
        );

      const data =
        response.data;

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

      toast.success(
        "Login Successful"
      );

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