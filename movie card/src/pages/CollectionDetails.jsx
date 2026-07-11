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
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import API from "../services/api";

import "../styles/Collections.css";

function CollectionDetails() {

  const { id } = useParams();
  const { showToast } = useToast();

  const [collection, setCollection] =
    useState(null);
  const [loading, setLoading] =
    useState(true);

  const loadCollection = useCallback(async () => {

    try {

      setLoading(true);

      const response =
        await API.get(`/collections/${id}`);

      setCollection(response.data);

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to load collection",
        "error"
      );

    } finally {

      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {

    loadCollection();

  }, [loadCollection]);

  const removeMovie = async (movieId) => {

    try {

      await API.delete(
        `/collections/${id}/movies/${movieId}`
      );

      showToast("Movie removed from collection");
      loadCollection();

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to remove movie",
        "error"
      );
    }
  };

  const shareCollection = async () => {

    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Collection link copied");
    } catch {
      showToast("Copy this page URL to share", "error");
    }
  };

  if (loading) {
    return (
      <div className="collections-page page-shell">
        <Navbar />
        <main className="collections-inner">
          <div className="collections-empty glass-panel">
            Loading collection...
          </div>
        </main>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="collections-page page-shell">
        <Navbar />
        <main className="collections-inner">
          <div className="collections-empty glass-panel">
            Collection not found.
          </div>
        </main>
      </div>
    );
  }

  const totalRuntime =
    collection.movies?.reduce((total, movie) => {
      const minutes = parseInt(movie.runtime, 10);
      return total + (Number.isNaN(minutes) ? 0 : minutes);
    }, 0) || 0;

  return (
    <div className="collections-page page-shell">
      <Navbar />

      <main className="collections-inner">
        <section className="collection-details-hero glass-panel">
          <div>
            <Link
              to="/collections"
              className="detail-back"
            >
              ‹ Back to Collections
            </Link>
            <h1>{collection.name}</h1>
            <p>{collection.description || "No description added."}</p>
            <div className="collection-detail-meta">
              <span>{collection.movie_count || 0} Movies</span>
              <span>{collection.visibility}</span>
              <span>Total runtime: {totalRuntime} min</span>
            </div>
          </div>

          {collection.visibility === "public" && (
            <button
              className="primary-action"
              onClick={shareCollection}
            >
              Share Public Link
            </button>
          )}
        </section>

        {collection.movies?.length === 0 ? (
          <div className="collections-empty glass-panel">
            No movies in this collection yet.
          </div>
        ) : (
          <section className="collection-detail-grid">
            {collection.movies.map((movie) => (
              <article
                key={movie.movie_id}
                className="collection-movie-card glass-panel"
              >
                <img
                  src={
                    movie.poster && movie.poster !== "N/A"
                      ? movie.poster
                      : "https://via.placeholder.com/300x450"
                  }
                  alt={movie.title}
                />

                <div>
                  <h2>{movie.title}</h2>
                  <p>{movie.year || "Year N/A"}</p>
                  <span>IMDb {movie.imdb_rating || "N/A"}</span>
                </div>

                {collection.can_edit && (
                  <button
                    className="danger-action"
                    onClick={() =>
                      removeMovie(movie.movie_id)
                    }
                  >
                    Remove from Collection
                  </button>
                )}
              </article>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CollectionDetails;
