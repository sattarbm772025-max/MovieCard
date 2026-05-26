import "./MovieCard.css";

import toast from "react-hot-toast";

function MovieCard({ movie }) {

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

  return (
    <div className="movie-card">

      {/* POSTER */}

      <img
        src={movie.poster}
        alt={movie.title}
        className="movie-image"
      />

      {/* CONTENT */}

      <div className="movie-content">

        {/* TITLE */}

        <h2 className="movie-title">
          {movie.title}
        </h2>

        {/* GENRE */}

        <p className="movie-genre">
          🎭 {movie.genre}
        </p>

        {/* RATING */}

        <div className="movie-rating">
          ⭐ {movie.rating}
        </div>

        {/* STORY */}

        <p className="movie-story">
          {movie.story ||
            "No movie description available."}
        </p>

        {/* BUTTONS */}

        <div className="movie-buttons">

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