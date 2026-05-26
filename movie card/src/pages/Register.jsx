import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import "../styles/Auth.css";

function Register() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = (e) => {

    e.preventDefault();

    if (!email || !password) {

      toast.error(
        "All fields required"
      );

      return;
    }

    // SAVE USER

    const user = {
      email,
      password,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    toast.success(
      "Registration Successful"
    );

    // GO LOGIN

    navigate("/login");
  };

  return (
    <div className="auth-container">

      <form
        className="auth-form"
        onSubmit={handleRegister}
      >

        <h1>Register</h1>

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