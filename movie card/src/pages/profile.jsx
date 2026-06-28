import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

      toast.success("Profile updated");
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

      toast.success("Password changed");
      setPassword("");
    };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-inner">
        <h1 className="page-title">
          Account Profile
        </h1>

        <p className="page-subtitle">
          Manage your identity and password for the movie dashboard.
        </p>

        <div className="profile-grid">
          <section className="glass-panel form-grid">
            <div style={{ padding: "24px" }}>
              <h2>Profile Details</h2>

              <div className="form-grid">
                <input
                  type="text"
                  value={profile.username}
                  placeholder="Username"
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
                  placeholder="Email"
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      email:
                        event.target.value,
                    })
                  }
                />

                <button
                  className="primary-action"
                  onClick={updateProfile}
                >
                  Update Profile
                </button>
              </div>
            </div>
          </section>

          <section className="glass-panel form-grid">
            <div style={{ padding: "24px" }}>
              <h2>Change Password</h2>

              <div className="form-grid">
                <input
                  type="password"
                  value={password}
                  placeholder="New password"
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                />

                <button
                  className="primary-action"
                  onClick={changePassword}
                >
                  Change Password
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
