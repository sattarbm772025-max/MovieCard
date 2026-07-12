import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";
import API from "../services/api";

import "../styles/MovieDetails.css";

function MovieDetails() {

  const { id } = useParams();
  const { showToast } = useToast();

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
  const [collections, setCollections] =
    useState([]);
  const [selectedCollections, setSelectedCollections] =
    useState([]);
  const [showCollectionPanel, setShowCollectionPanel] =
    useState(false);

  const fetchMovie = useCallback(async () => {

    try {

      const response =
        await API.get(`/movies/${id}`);

      setMovie(response.data);

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to load movie",
        "error"
      );

    } finally {

      setLoading(false);
    }
  }, [id, showToast]);

  const fetchReviews = useCallback(async () => {

    try {

      const response =
        await API.get(`/reviews/${id}`);

      setReviews(response.data);

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to load reviews",
        "error"
      );
    }
  }, [id, showToast]);

  const fetchAverageRating = useCallback(async () => {

    try {

      const response =
        await API.get(
          `/reviews/average/${id}`
        );

      setAverageRating(
        response.data.average_rating
      );

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to load average rating",
        "error"
      );
    }
  }, [id, showToast]);

  const fetchCollections = useCallback(async () => {

    try {

      const response =
        await API.get("/collections");

      setCollections(response.data);

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to load collections",
        "error"
      );
    }
  }, [showToast]);

  useEffect(() => {

    fetchMovie();
    fetchReviews();
    fetchAverageRating();
    fetchCollections();

  }, [
    fetchAverageRating,
    fetchCollections,
    fetchMovie,
    fetchReviews,
  ]);

  const submitReview = async () => {

    if (!reviewText.trim()) {
      showToast("Write your review first", "error");
      return;
    }

    try {

      await API.post(
        "/reviews",
          {
            movie_id: id,
            movie_title: movie.Title,
            review: reviewText,
            rating,
          }
      );

      showToast("Review added successfully");
      setReviewText("");
      setRating(5);
      fetchReviews();
      fetchAverageRating();

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to add review",
        "error"
      );
    }
  };

  const likeReview = async (reviewId) => {

    try {

      const response = await API.post(
        `/reviews/${reviewId}/like`
      );

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                like_count:
                  response.data.like_count ??
                  (review.like_count || 0) + 1,
              }
            : review
        )
      );

      showToast("Review liked");

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to like review",
        "error"
      );
    }
  };

  const deleteReview = async (reviewId) => {

    try {

      await API.delete(
        `/reviews/${reviewId}`
      );

      showToast("Review deleted");
      fetchReviews();
      fetchAverageRating();

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to delete review",
        "error"
      );
    }
  };

  const toggleCollection = (collectionId) => {

    setSelectedCollections((current) =>
      current.includes(collectionId)
        ? current.filter((idValue) => idValue !== collectionId)
        : [...current, collectionId]
    );
  };

  const addToCollections = async () => {

    if (selectedCollections.length === 0) {
      showToast("Select at least one collection", "error");
      return;
    }

    try {

      await Promise.all(
        selectedCollections.map((collectionId) =>
          API.post(
            `/collections/${collectionId}/movies`,
            {
              movie_id: id,
              title: movie.Title,
              poster: movie.Poster,
              genre: movie.Genre,
              year: movie.Year,
              imdb_rating: movie.imdbRating,
              runtime: movie.Runtime,
            }
          )
        )
      );

      showToast("Movie added to selected collections");
      setSelectedCollections([]);
      setShowCollectionPanel(false);

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to add movie to collections",
        "error"
      );
    }
  };

  if (loading) {

    return (
      <div className="details-page">
        <Navbar />
        <div className="details-loading glass-panel">
          Loading movie...
        </div>
      </div>
    );
  }

  if (!movie) {

    return (
      <div className="details-page">
        <Navbar />
        <div className="details-loading glass-panel">
          Movie not found
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <Navbar />

      <section
        className="movie-detail-hero"
        style={{
          backgroundImage:
            movie.Poster && movie.Poster !== "N/A"
              ? `linear-gradient(180deg, rgba(0,0,0,0.18), #09090b 78%), url(${movie.Poster})`
              : undefined,
        }}
      >
        <div className="movie-detail-shell">
          <Link
            to="/"
            className="detail-back"
          >
            Back
          </Link>

          <div className="detail-hero-grid">
            <img
              src={
                movie.Poster && movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/300x450"
              }
              alt={movie.Title}
              className="details-poster"
            />

            <div className="details-content">
              <div className="detail-kicker">
                {movie.Type || "Movie"} | {movie.Year}
              </div>

              <h1>{movie.Title}</h1>

              <div className="detail-tags">
                <span>IMDb {movie.imdbRating || "N/A"}</span>
                <span>User {averageRating || 0}/5</span>
                <span>{movie.Runtime || "Runtime N/A"}</span>
              </div>

              <p className="detail-plot">
                {movie.Plot}
              </p>

              <div className="detail-meta-grid">
                <div>
                  <span>Genre</span>
                  <strong>{movie.Genre || "N/A"}</strong>
                </div>
                <div>
                  <span>Director</span>
                  <strong>{movie.Director || "N/A"}</strong>
                </div>
                <div>
                  <span>Cast</span>
                  <strong>{movie.Actors || "N/A"}</strong>
                </div>
              </div>

              <div className="detail-actions">
                <button
                  className="primary-action"
                  onClick={() =>
                    setShowCollectionPanel(true)
                  }
                >
                  Add to Collection
                </button>
                <Link
                  to="/collections"
                  className="detail-link-button"
                >
                  Manage Collections
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="movie-detail-shell detail-body">
        <section className="review-panel glass-panel">
          <div className="review-panel-header">
            <div>
              <h2>Add Review</h2>
              <p>Rate this movie and share your thoughts.</p>
            </div>
            <span className="rating-pill">{rating}/5</span>
          </div>

          <div className="star-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={rating >= star ? "active" : ""}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            rows="5"
            value={reviewText}
            onChange={(event) =>
              setReviewText(event.target.value)
            }
            placeholder="What were your thoughts?"
          />

          <button
            className="primary-action"
            onClick={submitReview}
          >
            Post Review
          </button>
        </section>

        <section className="review-panel glass-panel">
          <h2>Reviews</h2>

          {reviews.length === 0 ? (
            <p className="detail-empty">No reviews yet.</p>
          ) : (
            <div className="review-list">
              {reviews.map((review) => {
                const isOwnReview =
                  String(review.user_id) ===
                  localStorage.getItem("user_id");

                return (
                  <article
                    key={review.id}
                    className="review-card"
                  >
                    <div>
                      <strong>Rating {review.rating}/5</strong>
                      <p>{review.review}</p>
                      {review.created_at && (
                        <small>
                          {new Date(review.created_at)
                            .toLocaleDateString()}
                        </small>
                      )}
                    </div>

                    <div className="review-card-actions">
                      <button
                        type="button"
                        onClick={() =>
                          likeReview(review.id)
                        }
                      >
                        Like ({review.like_count || 0})
                      </button>

                      {isOwnReview && (
                        <button
                          type="button"
                          className="delete-review-btn"
                          onClick={() =>
                            deleteReview(review.id)
                          }
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {showCollectionPanel && (
        <div className="collection-picker-backdrop">
          <section className="collection-picker glass-panel">
            <h2>Add to Collection</h2>
            <p>Select one or more collections.</p>

            {collections.length === 0 ? (
              <p className="detail-empty">
                You do not have collections yet.
              </p>
            ) : (
              <div className="collection-picker-list">
                {collections.map((collection) => (
                  <label key={collection.id}>
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(collection.id)}
                      onChange={() =>
                        toggleCollection(collection.id)
                      }
                    />
                    <span>{collection.name}</span>
                    <small>{collection.visibility}</small>
                  </label>
                ))}
              </div>
            )}

            <div className="collection-picker-actions">
              <button
                className="primary-action"
                onClick={addToCollections}
              >
                Add Movie
              </button>
              <button
                className="danger-action"
                onClick={() =>
                  setShowCollectionPanel(false)
                }
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
