import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../api/axios";
import {
  isCompareMovieSelected,
  toggleCompareMovie,
} from "../utils/compareSelection";
import "./MovieCard.css";

function MovieCard({ movie }) {

  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [isCompareSelected, setIsCompareSelected] =
    useState(() =>
      isCompareMovieSelected(movie.id)
    );

  const [isWatched, setIsWatched] =
    useState(false);

  useEffect(() => {

    let active = true;

    const checkFavorite = async () => {

      try {

        const response =
          await API.get("/favorites");

        if (!active) return;

        setIsFavorite(
          response.data.some(
            (item) =>
              item.movie_id === movie.id
          )
        );

      } catch {

        if (active) {
          setIsFavorite(false);
        }
      }
    };

    checkFavorite();

    return () => {
      active = false;
    };

  }, [movie.id]);

  useEffect(() => {

    let active = true;

    const checkWatched = async () => {

      try {

        const response =
          await API.get(
            `/watched/status/${movie.id}`
          );

        if (active) {
          setIsWatched(
            Boolean(response.data.watched)
          );
        }

      } catch {

        if (active) {
          setIsWatched(false);
        }
      }
    };

    checkWatched();

    return () => {
      active = false;
    };

  }, [movie.id]);

  useEffect(() => {

    const refreshCompareState = () => {
      setIsCompareSelected(
        isCompareMovieSelected(movie.id)
      );
    };

    window.addEventListener(
      "moviecard_compare_selection_changed",
      refreshCompareState
    );

    return () => {
      window.removeEventListener(
        "moviecard_compare_selection_changed",
        refreshCompareState
      );
    };

  }, [movie.id]);

  const addFavorite = async () => {

    try {

      if (isFavorite) {

        await API.delete(
          `/favorites/${movie.id}`
        );

        setIsFavorite(false);

        toast.success(
          "Removed from Favorites"
        );

        return;
      }

      await API.post(
        "/favorites",
        {
          movie_id: movie.id,
          title: movie.title,
          poster: movie.poster,
        }
      );

      setIsFavorite(true);

      toast.success(
        "Added to Favorites"
      );

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to update favorite"
      );
    }
  };

  const addWatchlist = async () => {

    try {

      await API.post(
        "/watchlist",
        {
          movie_id: movie.id,
          title: movie.title,
          poster: movie.poster,
          genre: movie.genre,
        }
      );

      toast.success(
        "Added to Watchlist"
      );

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to add watchlist"
      );
    }
  };

  const toggleCompare = () => {

    const result =
      toggleCompareMovie(movie);

    setIsCompareSelected(result.selected);

    if (result.limitReached) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  };

  const markAsWatched = async () => {

    try {

      await API.post(
        "/watched",
        {
          movie_id: movie.id,
          title: movie.title,
          poster: movie.poster,
          genre: movie.genre,
          imdb_rating: String(movie.rating || ""),
        }
      );

      setIsWatched(true);
      toast.success("Marked as watched");

    } catch (error) {

      if (
        error.response?.data?.detail ===
        "Movie already exists in watched history"
      ) {
        setIsWatched(true);
      }

      toast.error(
        error.response?.data?.detail ||
        "Failed to mark as watched"
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

      {isWatched && (
        <span className="watched-badge">
          Watched
        </span>
      )}

      <div className="movie-content">

        <div className="movie-meta-row">
          <span className="movie-rating">
            IMDb {movie.rating}
          </span>

          <span className="movie-chip">
            {movie.genre || "Movie"}
          </span>
        </div>

        <h2 className="movie-title">
          {movie.title}
        </h2>

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
              ? "Remove"
              : "Favorite"}
          </button>

          <button
            className="watch-btn"
            onClick={(e) => {
              e.stopPropagation();
              addWatchlist();
            }}
          >
            Watchlist
          </button>

          <button
            className={`compare-btn ${
              isCompareSelected ? "selected" : ""
            }`}
            aria-label={
              isCompareSelected
                ? "Remove from compare"
                : "Compare movie"
            }
            title={
              isCompareSelected
                ? "Selected for compare"
                : "Compare"
            }
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare();
            }}
          >
            {isCompareSelected
              ? "On"
              : "VS"}
          </button>

          <button
            className={`watched-btn ${
              isWatched ? "selected" : ""
            }`}
            disabled={isWatched}
            onClick={(e) => {
              e.stopPropagation();
              markAsWatched();
            }}
          >
            {isWatched ? "Watched" : "Mark Watched"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default MovieCard;
