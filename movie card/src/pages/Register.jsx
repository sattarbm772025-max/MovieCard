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

  const navigate =
    useNavigate();

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
      toast.success(
        "Registration Successful"
      );

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

      <form
        className="auth-form"
        onSubmit={handleRegister}
      >

        <h1>Register</h1>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          required
        />

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
          Register
        </button>

        <p>

          Already have account?

          <Link to="/login">
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Register;