import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  clearCompareSelection,
  getCompareSelection,
} from "../utils/compareSelection";

import "../styles/CompareMovies.css";

function scoreClass(
  movies,
  movie,
  key
) {

  const values =
    movies.map((item) => Number(item[key]) || 0);

  const max = Math.max(...values);
  const min = Math.min(...values);

  if (max === min) {
    return "";
  }

  return Number(movie[key]) === max
    ? "is-best"
    : "is-lower";
}

function DetailRow({
  label,
  value,
  highlightClass = "",
}) {

  return (
    <div className={`compare-detail ${highlightClass}`}>
      <span>{label}</span>
      <strong>{value || "N/A"}</strong>
    </div>
  );
}

function CompareMovies() {

  const [searchParams, setSearchParams] =
    useSearchParams();

  const selectedMovies =
    useMemo(() => getCompareSelection(), []);

  const initialMovieIds = [
    searchParams.get("movie1"),
    searchParams.get("movie2"),
    searchParams.get("movie3"),
  ].filter(Boolean);

  const [movieIds, setMovieIds] =
    useState(
      initialMovieIds.length >= 2
        ? initialMovieIds
        : selectedMovies
            .slice(0, 3)
            .map((movie) => movie.id)
    );

  const [movies, setMovies] =
    useState([]);

  const [summary, setSummary] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (movieIds.length < 2) {
      return;
    }

    const fetchComparison = async () => {

      try {

        setLoading(true);

        const params =
          new URLSearchParams();

        movieIds.forEach((movieId, index) => {
          params.set(
            `movie${index + 1}`,
            movieId
          );
        });

        const response =
          await API.get(
            `/movies/compare?${params.toString()}`
          );

        setMovies(response.data.movies || []);
        setSummary(response.data.summary || []);

        setSearchParams(params);

      } catch (error) {

        toast.error(
          error.response?.data?.detail ||
          "Failed to compare movies"
        );

      } finally {

        setLoading(false);
      }
    };

    fetchComparison();

  }, [
    movieIds,
    setSearchParams,
  ]);

  const clearSelection = () => {

    clearCompareSelection();
    setMovieIds([]);
    setMovies([]);
    setSummary([]);
    setSearchParams({});
    toast.success("Comparison cleared");
  };

  const shareComparison = async () => {

    const link = window.location.href;

    try {

      await navigator.clipboard.writeText(link);
      toast.success("Comparison link copied");

    } catch {

      toast.error("Copy this page URL to share");
    }
  };

  const exportPdf = () => {

    window.print();
  };

  return (
    <div className="compare-page page-shell">
      <Navbar />

      <main className="compare-inner">
        <header className="compare-header">
          <div>
            <h1 className="page-title">
              Compare Movies
            </h1>

            <p className="page-subtitle">
              Select up to three movies from Home and compare ratings, reviews, story, and key details.
            </p>
          </div>

          <div className="compare-actions">
            <button
              className="primary-action"
              onClick={shareComparison}
              disabled={movies.length < 2}
            >
              Share Link
            </button>

            <button
              className="primary-action"
              onClick={exportPdf}
              disabled={movies.length < 2}
            >
              Export PDF
            </button>

            <button
              className="danger-action"
              onClick={clearSelection}
            >
              Clear
            </button>
          </div>
        </header>

        {movieIds.length < 2 ? (

          <section className="compare-empty glass-panel">
            <h2>Select 2 or 3 movies to compare</h2>
            <p>
              Use the Compare button on any movie card. You can select up to three movies at a time.
            </p>
          </section>

        ) : loading ? (

          <section className="compare-empty glass-panel">
            Loading comparison...
          </section>

        ) : (

          <>
            <section className="compare-grid">
              {movies.map((movie) => (
                <article
                  key={movie.movie_id}
                  className="compare-card glass-panel"
                >
                  <img
                    src={
                      movie.poster &&
                      movie.poster !== "N/A"
                        ? movie.poster
                        : "https://via.placeholder.com/300x450"
                    }
                    alt={movie.title}
                  />

                  <div className="compare-card-content">
                    <h2>
                      {movie.title}
                    </h2>

                    <p className="compare-plot">
                      {movie.plot}
                    </p>

                    <div className="compare-details">
                      <DetailRow
                        label="Year"
                        value={movie.release_year}
                      />

                      <DetailRow
                        label="Genre"
                        value={movie.genre}
                      />

                      <DetailRow
                        label="Runtime"
                        value={movie.runtime}
                      />

                      <DetailRow
                        label="Director"
                        value={movie.director}
                      />

                      <DetailRow
                        label="Cast"
                        value={movie.cast}
                      />

                      <DetailRow
                        label="IMDb"
                        value={movie.imdb_rating}
                        highlightClass={scoreClass(
                          movies,
                          movie,
                          "imdb_rating"
                        )}
                      />

                      <DetailRow
                        label="User Rating"
                        value={movie.user_average_rating}
                        highlightClass={scoreClass(
                          movies,
                          movie,
                          "user_average_rating"
                        )}
                      />

                      <DetailRow
                        label="Reviews"
                        value={movie.total_reviews}
                        highlightClass={scoreClass(
                          movies,
                          movie,
                          "total_reviews"
                        )}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="compare-summary glass-panel">
              <h2>Comparison Summary</h2>

              {summary.map((message) => (
                <p key={message}>
                  {message}
                </p>
              ))}
            </section>
          </>

        )}
      </main>

      <Footer />
    </div>
  );
}

export default CompareMovies;
