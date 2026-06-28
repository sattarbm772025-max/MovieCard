import {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Watchlist() {

  const [movies, setMovies] =
    useState([]);

  const fetchWatchlist =
    async () => {

      const response =
        await API.get("/watchlist");

      setMovies(response.data);
    };

  useEffect(() => {

    fetchWatchlist();

  }, []);

  const removeMovie =
    async (movieId) => {

      await API.delete(
        `/watchlist/${movieId}`
      );

      fetchWatchlist();
    };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-inner">
        <header className="watchlist-top">
          <div>
            <p className="home-kicker">
              Saved for later
            </p>

            <h1 className="page-title">
              Watchlist
            </h1>

            <p className="page-subtitle">
              {movies.length} movie results waiting for your next night in.
            </p>
          </div>
        </header>

        {movies.length === 0 ? (

          <div className="empty-state">
            <h2>Your watchlist is empty.</h2>
            <p>Start adding movies to watch later.</p>
          </div>

        ) : (

          <div className="watchlist-list">
            {movies.map((movie) => (
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
                </div>

                <button
                  className="primary-action"
                  onClick={() =>
                    removeMovie(movie.movie_id)
                  }
                >
                  Remove
                </button>
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
