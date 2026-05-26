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

  const handleLogin = (e) => {

    e.preventDefault();

    const savedUser =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (
      !savedUser ||
      savedUser.email !== email ||
      savedUser.password !== password
    ) {

      toast.error(
        "Invalid Credentials"
      );

      return;
    }

    // SAVE TOKEN

    login("movie_app_token");

    toast.success(
      "Login Successful"
    );

    // GO HOME

    navigate("/");
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
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
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