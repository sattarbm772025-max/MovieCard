import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileStats from "../components/profile/ProfileStats";
import GenrePreferences from "../components/profile/GenrePreferences";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import API from "../services/api";

import "../styles/Profile.css";

function getInitials(username, email) {

  const source =
    username || email || "M";

  return source
    .slice(0, 2)
    .toUpperCase();
}

function Profile() {

  const navigate = useNavigate();

  const { logout } =
    useContext(AuthContext);

  const { showToast } =
    useToast();

  const [profile, setProfile] =
    useState({
      id: "",
      username: "",
      email: "",
    });

  const [draftProfile, setDraftProfile] =
    useState({
      username: "",
      email: "",
    });

  const [stats, setStats] =
    useState({
      watched_count: 0,
      favorites_count: 0,
      watchlist_count: 0,
      reviews_count: 0,
    });

  const [preferences, setPreferences] =
    useState([]);

  const [selectedGenre, setSelectedGenre] =
    useState("");

  const [passwordForm, setPasswordForm] =
    useState({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [editMode, setEditMode] =
    useState(false);

  const avatarInitials = useMemo(
    () =>
      getInitials(
        profile.username,
        profile.email
      ),
    [
      profile.email,
      profile.username,
    ]
  );

  const loadProfileData = useCallback(async () => {

    try {

      setLoading(true);

      const [
        profileResponse,
        statsResponse,
        preferencesResponse,
      ] = await Promise.allSettled([
        API.get("/profile"),
        API.get("/profile/stats"),
        API.get("/preferences"),
      ]);

      if (profileResponse.status === "fulfilled") {
        setProfile(profileResponse.value.data);
        setDraftProfile({
          username:
            profileResponse.value.data.username || "",
          email:
            profileResponse.value.data.email || "",
        });
      } else {
        showToast(
          profileResponse.reason?.response?.data?.detail ||
          "Failed to load profile details",
          "error"
        );
      }

      if (statsResponse.status === "fulfilled") {
        setStats({
          watched_count:
            statsResponse.value.data.watched_count || 0,
          favorites_count:
            statsResponse.value.data.favorites_count || 0,
          watchlist_count:
            statsResponse.value.data.watchlist_count || 0,
          reviews_count:
            statsResponse.value.data.reviews_count || 0,
        });
      } else {
        showToast(
          statsResponse.reason?.response?.data?.detail ||
          "Failed to load profile stats",
          "error"
        );
      }

      if (preferencesResponse.status === "fulfilled") {
        setPreferences(preferencesResponse.value.data);
      } else {
        setPreferences([]);
        showToast(
          preferencesResponse.reason?.response?.data?.detail ||
          "Failed to load genre preferences",
          "error"
        );
      }

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to load profile",
        "error"
      );

    } finally {

      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {

    loadProfileData();

  }, [loadProfileData]);

  const updateProfile = async () => {

    if (!draftProfile.username.trim()) {
      showToast("Username is required", "error");
      return;
    }

    if (!draftProfile.email.includes("@")) {
      showToast("Enter a valid email", "error");
      return;
    }

    try {

      await API.put(
        "/profile",
        draftProfile
      );

      setProfile({
        ...profile,
        ...draftProfile,
      });
      setEditMode(false);
      showToast("Profile updated");

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to update profile",
        "error"
      );
    }
  };

  const addPreference = async () => {

    if (!selectedGenre) {
      showToast("Select a genre", "error");
      return;
    }

    try {

      const response =
        await API.post(
          "/preferences",
          {
            genre: selectedGenre,
          }
        );

      setPreferences((current) => [
        ...current,
        response.data.preference,
      ]);
      setSelectedGenre("");
      showToast("Genre preference added");

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to add genre",
        "error"
      );
    }
  };

  const removePreference = async (id) => {

    try {

      await API.delete(
        `/preferences/${id}`
      );

      setPreferences((current) =>
        current.filter(
          (preference) =>
            preference.id !== id
        )
      );
      showToast("Genre preference removed");

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to remove genre",
        "error"
      );
    }
  };

  const changePassword = async () => {

    if (passwordForm.new_password.length < 6) {
      showToast(
        "New password must be at least 6 characters",
        "error"
      );
      return;
    }

    if (
      passwordForm.new_password !==
      passwordForm.confirm_password
    ) {
      showToast(
        "New password and confirm password do not match",
        "error"
      );
      return;
    }

    try {

      await API.put(
        "/profile/change-password",
        {
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password,
        }
      );

      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      showToast("Password changed");

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to change password",
        "error"
      );
    }
  };

  const handleLogout = () => {

    logout();
    showToast("Logged out");
    navigate("/login");
  };

  if (loading) {

    return (
      <div className="page-shell">
        <Navbar />
        <main className="page-inner">
          <div className="empty-state">
            <h2>Loading profile...</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page page-shell">
      <Navbar />

      <main className="profile-inner">
        <section className="profile-hero glass-panel">
          <div className="profile-avatar">
            {avatarInitials}
          </div>

          <div className="profile-identity">
            {editMode ? (
              <div className="profile-edit-grid">
                <input
                  type="text"
                  value={draftProfile.username}
                  onChange={(event) =>
                    setDraftProfile({
                      ...draftProfile,
                      username: event.target.value,
                    })
                  }
                  placeholder="Username"
                />

                <input
                  type="email"
                  value={draftProfile.email}
                  onChange={(event) =>
                    setDraftProfile({
                      ...draftProfile,
                      email: event.target.value,
                    })
                  }
                  placeholder="Email"
                />
              </div>
            ) : (
              <>
                <h1>{profile.username}</h1>
                <p>{profile.email}</p>
              </>
            )}
          </div>

          <div className="profile-header-actions">
            {editMode ? (
              <>
                <button
                  className="primary-action"
                  onClick={updateProfile}
                >
                  Save
                </button>

                <button
                  className="danger-action"
                  onClick={() => {
                    setDraftProfile({
                      username: profile.username,
                      email: profile.email,
                    });
                    setEditMode(false);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="primary-action"
                onClick={() =>
                  setEditMode(true)
                }
              >
                Edit Profile
              </button>
            )}
          </div>
        </section>

        <ProfileStats stats={stats} />

        <div className="profile-content-grid">
          <GenrePreferences
            preferences={preferences}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            onAdd={addPreference}
            onRemove={removePreference}
          />

          <section className="profile-panel glass-panel">
            <div className="profile-panel-header">
              <div>
                <h2>Change Password</h2>
                <p>
                  Update your password with your current password.
                </p>
              </div>
            </div>

            <div className="profile-form-grid">
              <input
                type="password"
                value={passwordForm.old_password}
                placeholder="Old password"
                onChange={(event) =>
                  setPasswordForm({
                    ...passwordForm,
                    old_password:
                      event.target.value,
                  })
                }
              />

              <input
                type="password"
                value={passwordForm.new_password}
                placeholder="New password"
                onChange={(event) =>
                  setPasswordForm({
                    ...passwordForm,
                    new_password:
                      event.target.value,
                  })
                }
              />

              <input
                type="password"
                value={passwordForm.confirm_password}
                placeholder="Confirm new password"
                onChange={(event) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirm_password:
                      event.target.value,
                  })
                }
              />

              <button
                className="primary-action"
                onClick={changePassword}
              >
                Change Password
              </button>
            </div>
          </section>
        </div>

        <section className="profile-account glass-panel">
          <div>
            <h2>Account</h2>
            <p>
              Logout clears your session token and returns you to login.
            </p>
          </div>

          <button
            className="danger-action"
            onClick={handleLogout}
          >
            Logout
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
