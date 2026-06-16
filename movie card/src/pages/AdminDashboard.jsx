import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function AdminDashboard() {

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch("http://127.0.0.1:8000/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch("http://127.0.0.1:8000/admin/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data));

  }, []);

  const deleteReview = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this review?"
    );

    if (!confirmDelete) return;

    await fetch(
      `http://127.0.0.1:8000/admin/reviews/${id}`,
      {
        method: "DELETE",
      }
    );

    setReviews(
      reviews.filter(
        (review) => review.id !== id
      )
    );
  };

  return (
    <div>

      <Navbar />

      <div style={{ padding: "20px" }}>

        <h1>Admin Dashboard</h1>

        <h2>Statistics</h2>

        <p>
          Total Users:
          {stats.total_users}
        </p>

        <p>
          Total Reviews:
          {stats.total_reviews}
        </p>

        <p>
          Total Favorites:
          {stats.total_favorites}
        </p>

        <p>
          Most Searched Movie:
          {stats.most_searched_movie}
        </p>

        <hr />

        <h2>User List</h2>

        <table border="1" cellPadding="10">

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

                <td>
                  {user.is_admin
                    ? "Admin"
                    : "User"}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <hr />

        <h2>Review Moderation</h2>

        <table border="1" cellPadding="10">

          <thead>

            <tr>

              <th>ID</th>

              <th>Movie ID</th>

              <th>Review</th>

              <th>Rating</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {reviews.map((review) => (

              <tr key={review.id}>

                <td>{review.id}</td>

                <td>{review.movie_id}</td>

                <td>{review.review}</td>

                <td>{review.rating}</td>

                <td>

                  <button
                    onClick={() =>
                      deleteReview(
                        review.id
                      )
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

    </div>
  );
}

export default AdminDashboard;