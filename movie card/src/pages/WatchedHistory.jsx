import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/WatchedHistory.css";

function WatchedHistory() {

  const [movies, setMovies] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [genreFilter, setGenreFilter] =
    useState("All");

  const [sortOrder, setSortOrder] =
    useState("newest");

  const fetchWatched = async () => {

    try {

      setLoading(true);

      const response =
        await API.get("/watched");

      setMovies(response.data);

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to load watched history"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchWatched();

  }, []);

  const genres = useMemo(() => {

    const genreSet = new Set();

    movies.forEach((movie) => {
      movie.genre
        ?.split(",")
        .map((genre) => genre.trim())
        .filter(Boolean)
        .forEach((genre) =>
          genreSet.add(genre)
        );
    });

    return [
      "All",
      ...Array.from(genreSet).sort(),
    ];

  }, [movies]);

  const filteredMovies = useMemo(() => {

    const filtered =
      genreFilter === "All"
        ? movies
        : movies.filter((movie) =>
            movie.genre
              ?.toLowerCase()
              .includes(
                genreFilter.toLowerCase()
              )
          );

    return [...filtered].sort((first, second) => {
      const firstDate =
        new Date(first.watched_at).getTime();
      const secondDate =
        new Date(second.watched_at).getTime();

      return sortOrder === "newest"
        ? secondDate - firstDate
        : firstDate - secondDate;
    });

  }, [
    genreFilter,
    movies,
    sortOrder,
  ]);

  const removeWatched = async (movieId) => {

    try {

      await API.delete(
        `/watched/${movieId}`
      );

      toast.success("Removed from watched history");
      fetchWatched();

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to remove movie"
      );
    }
  };

  const moveToWatchlist = async (movie) => {

    try {

      await API.post(
        `/watched/${movie.movie_id}/move-to-watchlist`,
        {
          movie_id: movie.movie_id,
          title: movie.title,
          poster: movie.poster,
          genre: movie.genre,
        }
      );

      toast.success("Moved back to watchlist");
      fetchWatched();

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to move movie"
      );
    }
  };

  return (
    <div className="watched-page page-shell">
      <Navbar />

      <main className="watched-inner">
        <header className="watched-header">
          <div>
            <h1 className="page-title">
              Watched History
            </h1>

            <p className="page-subtitle">
              {movies.length} total watched movies.
            </p>
          </div>

          <div className="watched-count glass-panel">
            <span>Total Watched</span>
            <strong>{movies.length}</strong>
          </div>
        </header>

        <section className="watched-toolbar glass-panel">
          <label>
            Genre
            <select
              value={genreFilter}
              onChange={(event) =>
                setGenreFilter(event.target.value)
              }
            >
              {genres.map((genre) => (
                <option
                  key={genre}
                  value={genre}
                >
                  {genre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Sort by Watched Date
            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value)
              }
            >
              <option value="newest">
                Newest first
              </option>
              <option value="oldest">
                Oldest first
              </option>
            </select>
          </label>
        </section>

        {loading ? (

          <div className="empty-state">
            <h2>Loading watched history...</h2>
          </div>

        ) : filteredMovies.length === 0 ? (

          <div className="empty-state">
            <h2>No watched movies found.</h2>
            <p>
              Mark movies as watched to build your history.
            </p>
          </div>

        ) : (

          <section className="watched-grid">
            {filteredMovies.map((movie) => (
              <article
                key={movie.movie_id}
                className="watched-card glass-panel"
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

                <div className="watched-card-content">
                  <span className="watched-status">
                    Watched
                  </span>

                  <h2>{movie.title}</h2>

                  <p>{movie.genre || "Genre not available"}</p>

                  <div className="watched-meta">
                    <span>
                      IMDb {movie.imdb_rating || "N/A"}
                    </span>
                    <span>
                      {new Date(movie.watched_at)
                        .toLocaleDateString()}
                    </span>
                  </div>

                  <div className="watched-actions">
                    <button
                      className="primary-action"
                      onClick={() =>
                        moveToWatchlist(movie)
                      }
                    >
                      Move to Watchlist
                    </button>

                    <button
                      className="danger-action"
                      onClick={() =>
                        removeWatched(movie.movie_id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

        )}
      </main>

      <Footer />
    </div>
  );
}

export default WatchedHistory;
