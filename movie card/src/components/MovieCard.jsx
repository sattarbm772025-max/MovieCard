import "./MovieCard.css";

import toast from "react-hot-toast";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {

  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] =
    useState(() => {

      const favorites =
        JSON.parse(
          localStorage.getItem("favorites")
        ) || [];

      return favorites.some(
        (item) => item.id === movie.id
      );
    });

  const addFavorite = () => {

    let favorites =
      JSON.parse(
        localStorage.getItem("favorites")
      ) || [];

    if (isFavorite) {

      const updated = favorites.filter(
        (item) => item.id !== movie.id
      );

      localStorage.setItem(
        "favorites",
        JSON.stringify(updated)
      );

      setIsFavorite(false);

      toast.success(
        "Removed from Favorites"
      );

      return;
    }

    const exists = favorites.find(
      (item) => item.id === movie.id
    );

    if (exists) {

      toast.error(
        "Already in Favorites"
      );

      return;
    }

    favorites.push(movie);

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

    setIsFavorite(true);

    toast.success(
      "Added to Favorites"
    );
  };

  const addWatchlist = () => {

    let watchlist =
      JSON.parse(
        localStorage.getItem("watchlist")
      ) || [];

    const exists = watchlist.find(
      (item) => item.id === movie.id
    );

    if (exists) {

      toast.error(
        "Already in Watchlist"
      );

      return;
    }

    watchlist.push(movie);

    localStorage.setItem(
      "watchlist",
      JSON.stringify(watchlist)
    );

    toast.success(
      "Added to Watchlist"
    );
  };

  return (

    <div
      className="movie-card"
      onClick={() =>
        navigate(`/movie/${movie.id}`)
      }
    >

      <img
        src={movie.poster}
        alt={movie.title}
        className="movie-image"
      />

      <div className="movie-content">

        <h2 className="movie-title">
          {movie.title}
        </h2>

        <p className="movie-genre">
          🎭 {movie.genre}
        </p>

        <div className="movie-rating">
          ⭐ {movie.rating}
        </div>

        <p className="movie-story">
          {movie.story ||
            "No movie description available."}
        </p>

        <div className="movie-buttons">

          <button
            className="favorite-btn"
            onClick={(e) => {
              e.stopPropagation();
              addFavorite();
            }}
          >
            {isFavorite
              ? "💔 Remove"
              : "❤️ Favorite"}
          </button>

          <button
            className="watch-btn"
            onClick={(e) => {
              e.stopPropagation();
              addWatchlist();
            }}
          >
            👁 Watchlist
          </button>

        </div>

      </div>

    </div>
  );
}

export default MovieCard;