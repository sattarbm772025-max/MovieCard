import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
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
      <div>
        <Navbar />
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {

    return (
      <div>
        <Navbar />
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div>

      <Navbar />

      <h1>
        Admin Dashboard
      </h1>

      <hr />

      <h2>
        Dashboard Statistics
      </h2>

      <h3>
        Total Users: {stats.total_users}
      </h3>

      <h3>
        Total Reviews: {stats.total_reviews}
      </h3>

      <h3>
        Total Favorites: {stats.total_favorites}
      </h3>

      <h3>
        Most Searched Movie: {stats.most_searched_movie}
      </h3>

      <hr />

      <h2>
        User List
      </h2>

      <table border="1">

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

      <hr />

      <h2>
        Review Moderation
      </h2>

      <table border="1">

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

    </div>
  );
}

export default AdminDashboard;