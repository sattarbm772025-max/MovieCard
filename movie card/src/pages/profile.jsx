import { useEffect, useState } from "react";

import API from "../api/axios";
import Navbar from "../components/Navbar";

function Profile() {

  const [profile, setProfile] =
    useState({
      username: "",
      email: "",
    });

  const [password, setPassword] =
    useState("");

  useEffect(() => {

    API.get("/profile")
      .then((response) =>
        setProfile(response.data)
      );

  }, []);

  const updateProfile =
    async () => {

      await API.put(
        "/profile",
        profile
      );

      alert(
        "Profile Updated"
      );
    };

  const changePassword =
    async () => {

      await API.put(
        "/profile/change-password",
        {
          new_password:
            password,
        }
      );

      alert(
        "Password Changed"
      );

      setPassword("");
    };

  return (

    <>
      <Navbar />

      <div
        style={{
          maxWidth: "500px",
          margin: "30px auto",
        }}
      >

        <h2>
          User Profile
        </h2>

        <input
          type="text"
          value={profile.username}
          onChange={(event) =>
            setProfile({
              ...profile,
              username:
                event.target.value,
            })
          }
        />

        <input
          type="email"
          value={profile.email}
          onChange={(event) =>
            setProfile({
              ...profile,
              email:
                event.target.value,
            })
          }
        />

        <button
          onClick={
            updateProfile
          }
        >
          Update Profile
        </button>

        <hr />

        <h3>
          Change Password
        </h3>

        <input
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
        />

        <button
          onClick={
            changePassword
          }
        >
          Change Password
        </button>

      </div>
    </>
  );
}

export default Profile;