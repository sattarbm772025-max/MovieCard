import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {

  const { isAdmin } =
    useContext(AuthContext);

  const [stats, setStats] =
    useState({});

  const [users, setUsers] =
    useState([]);

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadAdminData =
    useCallback(async () => {

      try {

        setLoading(true);
        setError("");

        const [
          statsRes,
          usersRes,
          reviewsRes,
        ] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/users"),
          API.get("/admin/reviews"),
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setReviews(reviewsRes.data);

      } catch (err) {

        setError(
          err.response?.data?.detail ||
          err.message ||
          "Failed to load admin dashboard"
        );

      } finally {

        setLoading(false);
      }
    }, []);

  useEffect(() => {

    if (!isAdmin) {

      setLoading(false);
      setError("Admin access required");
      return;
    }

    loadAdminData();

  }, [isAdmin, loadAdminData]);

  const deleteReview =
    async (reviewId) => {

      try {

        await API.delete(
          `/admin/reviews/${reviewId}`
        );

        setReviews((currentReviews) =>
          currentReviews.filter(
            (review) =>
              review.id !== reviewId
          )
        );

      } catch (err) {

        alert(
          err.response?.data?.detail ||
          "Failed to delete review"
        );
      }
    };

  if (loading) {

    return (
      <div className="page-shell">
        <Navbar />
        <main className="page-inner">
          <h2>Loading...</h2>
        </main>
      </div>
    );
  }

  if (error) {

    return (
      <div className="page-shell">
        <Navbar />
        <main className="page-inner">
          <h2>Error: {error}</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-inner admin-grid">
        <div>
          <h1 className="page-title">
            Admin Dashboard
          </h1>

          <p className="page-subtitle">
            Monitor users, reviews, favorites, and search activity.
          </p>
        </div>

        <section className="stats-grid">
          <div className="stat-card glass-panel">
            <span>Total Users</span>
            <strong>{stats.total_users}</strong>
          </div>

          <div className="stat-card glass-panel">
            <span>Total Reviews</span>
            <strong>{stats.total_reviews}</strong>
          </div>

          <div className="stat-card glass-panel">
            <span>Total Favorites</span>
            <strong>{stats.total_favorites}</strong>
          </div>

          <div className="stat-card glass-panel">
            <span>Top Search</span>
            <strong>{stats.most_searched_movie}</strong>
          </div>
        </section>

        <section className="glass-panel" style={{ padding: "20px" }}>
          <h2>User List</h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Admin</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.is_admin ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="glass-panel" style={{ padding: "20px" }}>
          <h2>Review Moderation</h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Movie</th>
                <th>Comment</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>{review.movie_id}</td>
                  <td>{review.review}</td>
                  <td>
                    <button
                      className="danger-action"
                      onClick={() =>
                        deleteReview(review.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
