import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import "../styles/MovieDetails.css";

function MovieDetails() {

  const { id } = useParams();

  const [movie, setMovie] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [reviews, setReviews] =
    useState([]);

  const [reviewText, setReviewText] =
    useState("");

  const [rating, setRating] =
    useState(5);

  const [averageRating, setAverageRating] =
    useState(0);

  const fetchMovie = async () => {

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/movies/${id}`
      );

      const data = await response.json();

      setMovie(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  const fetchReviews = async () => {

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/reviews/${id}`
      );

      const data = await response.json();

      setReviews(data);

    } catch (error) {

      console.log(error);
    }
  };

  const fetchAverageRating =
    async () => {

      try {

        const response =
          await fetch(
            `http://127.0.0.1:8000/reviews/average/${id}`
          );

        const data =
          await response.json();

        setAverageRating(
          data.average_rating
        );

      } catch (error) {

        console.log(error);
      }
    };

  const submitReview =
    async () => {

      try {

        const response =
          await fetch(
            "http://127.0.0.1:8000/reviews",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                movie_id: id,
                review: reviewText,
                rating: rating,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          alert(
            data.detail
          );

          return;
        }

        alert(
          "Review Added Successfully"
        );

        setReviewText("");

        setRating(5);

        fetchReviews();

        fetchAverageRating();

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchMovie();

    fetchReviews();

    fetchAverageRating();

  }, [id]);

  if (loading) {

    return (
      <>
        <Navbar />

        <h2
          style={{
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          Loading...
        </h2>
      </>
    );
  }

  return (

    <div className="details-page">

      <Navbar />

      <div className="details-container">

        <img
          src={movie.Poster}
          alt={movie.Title}
          className="details-poster"
        />

        <div className="details-content">

          <h1>
            {movie.Title}
          </h1>

          <p>
            <strong>Year:</strong>{" "}
            {movie.Year}
          </p>

          <p>
            <strong>Genre:</strong>{" "}
            {movie.Genre}
          </p>

          <p>
            <strong>IMDb Rating:</strong>{" "}
            ⭐ {movie.imdbRating}
          </p>

          <p>
            <strong>
              User Rating:
            </strong>{" "}
            ⭐ {averageRating}
          </p>

          <p>
            <strong>Plot:</strong>{" "}
            {movie.Plot}
          </p>

          <hr />

          <h2>
            Add Review
          </h2>

          <textarea
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
            }}
            value={reviewText}
            onChange={(e) =>
              setReviewText(
                e.target.value
              )
            }
            placeholder="Write your review..."
          />

          <div
            style={{
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >

            {[1,2,3,4,5].map(
              (star) => (

                <span
                  key={star}
                  onClick={() =>
                    setRating(star)
                  }
                  style={{
                    cursor:
                      "pointer",
                    fontSize:
                      "30px",
                    color:
                      rating >= star
                        ? "gold"
                        : "gray",
                  }}
                >
                  ★
                </span>

              )
            )}

          </div>

          <button
            onClick={
              submitReview
            }
          >
            Submit Review
          </button>

          <hr />

          <h2>
            Reviews
          </h2>

          {reviews.length === 0 ? (

            <p>
              No reviews yet
            </p>

          ) : (

            reviews.map(
              (review) => (

                <div
                  key={review.id}
                  style={{
                    marginBottom:
                      "20px",
                    paddingBottom:
                      "10px",
                    borderBottom:
                      "1px solid #ddd",
                  }}
                >

                  <p>
                    ⭐ {review.rating}/5
                  </p>

                  <p>
                    {review.review}
                  </p>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>
  );
}

export default MovieDetails;