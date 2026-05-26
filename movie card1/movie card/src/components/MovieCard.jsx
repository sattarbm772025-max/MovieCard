import { useState } from "react";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="card">
      <img
        className="poster"
        src={
          movie.image && movie.image !== "N/A"
            ? movie.image
            : "https://via.placeholder.com/300x450"
        }
        alt={movie.title}
      />

      <div className="content">
        <h2>{movie.title}</h2>

        <p>
          <b>Genre:</b> {movie.genre}
        </p>

        <div className="rating">
          ⭐ {movie.rating}
        </div>

        <p className="desc">{movie.description}</p>

        <button
          className={added ? "btn added" : "btn"}
          onClick={() => setAdded(!added)}
        >
          {added ? "Added ✓" : "Add to Watchlist"}
        </button>
      </div>
    </div>
  );
}

export default MovieCard;