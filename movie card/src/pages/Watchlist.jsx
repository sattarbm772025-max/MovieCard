import {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

function Watchlist() {

  const [movies, setMovies] =
    useState([]);

  const [watchedMovies, setWatchedMovies] =
    useState([]);

  const [activeFilter, setActiveFilter] =
    useState("watchlist");

  const [loading, setLoading] =
    useState(true);

  const fetchWatchlist =
    async () => {

      try {

        setLoading(true);

        const [
          watchlistResponse,
          watchedResponse,
        ] = await Promise.all([
          API.get("/watchlist"),
          API.get("/watched"),
        ]);

        setMovies(watchlistResponse.data);
        setWatchedMovies(watchedResponse.data);

      } catch (error) {

        toast.error(
          error.response?.data?.detail ||
          "Failed to load movies"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchWatchlist();

  }, []);

  const removeMovie =
    async (movieId) => {

      try {

        await API.delete(
          `/watchlist/${movieId}`
        );

        toast.success("Movie removed");
        fetchWatchlist();

      } catch (error) {

        toast.error(
          error.response?.data?.detail ||
          "Failed to remove movie"
        );
      }
    };

  const markWatched =
    async (movie) => {

      try {

        let imdbRating =
          movie.imdb_rating || "";

        if (!imdbRating) {
          try {
            const details =
              await API.get(
                `/movies/${movie.movie_id}`
              );

            imdbRating =
              details.data.imdbRating || "";
          } catch {
            imdbRating = "";
          }
        }

        await API.post(
          "/watched",
          {
            movie_id: movie.movie_id,
            title: movie.title,
            poster: movie.poster,
            genre: movie.genre,
            imdb_rating: imdbRating,
          }
        );

        toast.success("Marked as watched");
        fetchWatchlist();

      } catch (error) {

        toast.error(
          error.response?.data?.detail ||
          "Failed to mark as watched"
        );
      }
    };

  const removeWatched =
    async (movieId) => {

      try {

        await API.delete(
          `/watched/${movieId}`
        );

        toast.success("Removed from watched");
        fetchWatchlist();

      } catch (error) {

        toast.error(
          error.response?.data?.detail ||
          "Failed to remove watched movie"
        );
      }
    };

  const moveToWatchlist =
    async (movie) => {

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
        fetchWatchlist();

      } catch (error) {

        toast.error(
          error.response?.data?.detail ||
          "Failed to move movie"
        );
      }
    };

  const visibleMovies =
    activeFilter === "watchlist"
      ? movies
      : watchedMovies;

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-inner">
        <header className="watchlist-top">
          <div>
            <h1 className="page-title">
              Watchlist
            </h1>

            <p className="page-subtitle">
              {movies.length} waiting and {watchedMovies.length} watched.
            </p>
          </div>
        </header>

        <div className="watchlist-filters glass-panel">
          <button
            className={activeFilter === "watchlist" ? "active" : ""}
            onClick={() => setActiveFilter("watchlist")}
          >
            Watchlist
          </button>

          <button
            className={activeFilter === "watched" ? "active" : ""}
            onClick={() => setActiveFilter("watched")}
          >
            Watched
          </button>
        </div>

        {loading ? (

          <div className="empty-state">
            <h2>Loading movies...</h2>
          </div>

        ) : visibleMovies.length === 0 ? (

          <div className="empty-state">
            <h2>
              {activeFilter === "watchlist"
                ? "Your watchlist is empty."
                : "Your watched list is empty."}
            </h2>
            <p>
              {activeFilter === "watchlist"
                ? "Start adding movies to watch later."
                : "Mark movies as watched to build your history."}
            </p>
          </div>

        ) : (

          <div className="watchlist-list">
            {visibleMovies.map((movie) => (
              <article
                key={movie.movie_id}
                className="watchlist-card glass-panel"
              >
                <img
                  src={
                    movie.poster &&
                    movie.poster !== "N/A"
                      ? movie.poster
                      : "https://via.placeholder.com/160x230"
                  }
                  alt={movie.title}
                />

                <div className="watchlist-content">
                  <h2>
                    {movie.title}
                  </h2>

                  <p>
                    {movie.genre || "Genre not available"}
                  </p>

                  {activeFilter === "watched" && (
                    <small>
                      Watched:{" "}
                      {new Date(movie.watched_at)
                        .toLocaleDateString()}
                    </small>
                  )}
                </div>

                <div className="watchlist-actions">
                  {activeFilter === "watchlist" ? (
                    <>
                      <button
                        className="primary-action"
                        onClick={() =>
                          markWatched(movie)
                        }
                      >
                        Mark Watched
                      </button>

                      <button
                        className="danger-action"
                        onClick={() =>
                          removeMovie(movie.movie_id)
                        }
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>

        )}
      </main>

      <Footer />
    </div>
  );
}

export default Watchlist;
