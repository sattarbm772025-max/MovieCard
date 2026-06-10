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

  const addWatchlist = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/watchlist",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            movie_id: movie.id,
            title: movie.title,
            poster: movie.poster,
            genre: movie.genre,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        toast.error(
          data.detail
        );

        return;
      }

      toast.success(
        "Added to Watchlist"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to add watchlist"
      );
    }
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