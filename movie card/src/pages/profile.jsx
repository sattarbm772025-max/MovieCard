import { useEffect, useState } from "react";

function Profile() {

  const [profile, setProfile] =
    useState({
      username: "",
      email: ""
    });

  const [password, setPassword] =
    useState("");

  useEffect(() => {

    fetch(
      "http://127.0.0.1:8000/profile"
    )
      .then((res) => res.json())
      .then((data) =>
        setProfile(data)
      );

  }, []);

  const updateProfile =
    async () => {

      await fetch(
        "http://127.0.0.1:8000/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(
            profile
          )
        }
      );

      alert(
        "Profile Updated"
      );
    };

  const changePassword =
    async () => {

      await fetch(
        "http://127.0.0.1:8000/profile/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            new_password:
              password
          })
        }
      );

      alert(
        "Password Changed"
      );

      setPassword("");
    };

  return (

    <div
      style={{
        maxWidth: "500px",
        margin: "30px auto"
      }}
    >

      <h2>
        User Profile
      </h2>

      <input
        type="text"
        value={profile.username}
        onChange={(e) =>
          setProfile({
            ...profile,
            username:
              e.target.value
          })
        }
      />

      <input
        type="email"
        value={profile.email}
        onChange={(e) =>
          setProfile({
            ...profile,
            email:
              e.target.value
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
        onChange={(e) =>
          setPassword(
            e.target.value
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
  );
}

export default Profile;