import "./MovieCard.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const addFavorite = () => {
    let favorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = favorites.find(
      (item) => item.id === movie.id
    );

    if (exists) {
      toast.error("Already in favorites");
      return;
    }

    favorites.push(movie);

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

    toast.success("Added to Favorites");
  };

  const addWatchlist = () => {
    let watchlist =
      JSON.parse(localStorage.getItem("watchlist")) || [];

    const exists = watchlist.find(
      (item) => item.id === movie.id
    );

    if (exists) {
      toast.error("Already in Watchlist");
      return;
    }

    watchlist.push(movie);

    localStorage.setItem(
      "watchlist",
      JSON.stringify(watchlist)
    );

    toast.success("Added to Watchlist");
  };

  const goToDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      className="movie-card"
      onClick={goToDetails}
      style={{ cursor: "pointer" }}
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

        <div
          className="movie-buttons"
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          <button
            className="favorite-btn"
            onClick={addFavorite}
          >
            ❤️ Favorite
          </button>

          <button
            className="watch-btn"
            onClick={addWatchlist}
          >
            👁 Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;