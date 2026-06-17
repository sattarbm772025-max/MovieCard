import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

function AdminDashboard() {

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

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    Promise.all([

      fetch(
        "http://127.0.0.1:8000/admin/stats",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      ),

      fetch(
        "http://127.0.0.1:8000/admin/users",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      ),

      fetch(
        "http://127.0.0.1:8000/admin/reviews",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )

    ])

    .then(async ([

      statsRes,
      usersRes,
      reviewsRes

    ]) => {

      if (
        !statsRes.ok ||
        !usersRes.ok ||
        !reviewsRes.ok
      ) {

        throw new Error(
          "Unauthorized or API error"
        );
      }

      const statsData =
        await statsRes.json();

      const usersData =
        await usersRes.json();

      const reviewsData =
        await reviewsRes.json();

      setStats(statsData);

      setUsers(usersData);
      
      console.log(reviewsData);

      setReviews(reviewsData);

      setLoading(false);

    })

    .catch((err) => {

      setError(err.message);

      setLoading(false);

    });

  }, []);

  const deleteReview =
    async (reviewId) => {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(

          `http://127.0.0.1:8000/admin/reviews/${reviewId}`,

          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      if (response.ok) {

        setReviews(

          reviews.filter(
            (review) =>
              review.id !== reviewId
          )
        );

      } else {

        alert(
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
        Total Users:
        {" "}
        {stats.total_users}
      </h3>

      <h3>
        Total Reviews:
        {" "}
        {stats.total_reviews}
      </h3>

      <h3>
        Total Favorites:
        {" "}
        {stats.total_favorites}
      </h3>

      <h3>
        Most Searched Movie:
        {" "}
        {stats.most_searched_movie}
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

              <td>
                {user.id}
              </td>

              <td>
                {user.username}
              </td>

              <td>
                {user.email}
              </td>

              <td>
                {user.is_admin
                  ? "Yes"
                  : "No"}
              </td>

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

              <td>
                {review.id}
              </td>

              <td>
                {review.movie_id}
              </td>

              <td>
                {review.review}
              </td>

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
  );
}

export default AdminDashboard;