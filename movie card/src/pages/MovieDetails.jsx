import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../api/axios";
import Navbar from "../components/Navbar";

import "../styles/MovieDetails.css";

function MovieDetails() {

  const { id } = useParams();

  const [movie, setMovie] =
    useState(null);

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

  const fetchMovie = useCallback(async () => {

    try {

      const response =
        await API.get(`/movies/${id}`);

      setMovie(response.data);

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to load movie"
      );

    } finally {

      setLoading(false);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {

    try {

      const response =
        await API.get(`/reviews/${id}`);

      setReviews(response.data);

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to load reviews"
      );
    }
  }, [id]);

  const fetchAverageRating =
    useCallback(async () => {

      try {

        const response =
          await API.get(
            `/reviews/average/${id}`
          );

        setAverageRating(
          response.data.average_rating
        );

      } catch (error) {

        toast.error(
          error.response?.data?.detail ||
          "Failed to load average rating"
        );
      }
    }, [id]);

  const submitReview =
    async () => {

      try {

        await API.post(
          "/reviews",
          {
            movie_id: id,
            review: reviewText,
            rating,
          }
        );

        toast.success(
          "Review Added Successfully"
        );

        setReviewText("");
        setRating(5);

        fetchReviews();
        fetchAverageRating();

      } catch (error) {

        toast.error(
          error.response?.data?.detail ||
          "Failed to add review"
        );
      }
    };

  const likeReview = async (reviewId) => {

    try {

      await API.post(
        `/reviews/${reviewId}/like`
      );

      toast.success("Review liked");

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to like review"
      );
    }
  };

  useEffect(() => {

    fetchMovie();
    fetchReviews();
    fetchAverageRating();

  }, [
    fetchAverageRating,
    fetchMovie,
    fetchReviews,
  ]);

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

  if (!movie) {

    return (
      <>
        <Navbar />

        <h2
          style={{
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          Movie not found
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
            {movie.imdbRating}
          </p>

          <p>
            <strong>User Rating:</strong>{" "}
            {averageRating}
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
            onChange={(event) =>
              setReviewText(
                event.target.value
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

            {[1, 2, 3, 4, 5].map(
              (star) => (

                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setRating(star)
                  }
                  style={{
                    cursor: "pointer",
                    fontSize: "30px",
                    color:
                      rating >= star
                        ? "gold"
                        : "gray",
                    background: "transparent",
                    border: "none",
                  }}
                >
                  *
                </button>

              )
            )}

          </div>

          <button
            onClick={submitReview}
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
                    marginBottom: "20px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >

                  <p>
                    Rating: {review.rating}/5
                  </p>

                  <p>
                    {review.review}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      likeReview(review.id)
                    }
                    style={{
                      background: "#ffd60a",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Like Review
                  </button>

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
