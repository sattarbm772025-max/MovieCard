import { useState } from "react";
import "./MovieCard.css";

function MovieCard({ movie, setSelectedMovie }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="card">
      <img className="poster" src={movie.Poster} alt={movie.Title} />

      <div className="content">
        <h2>{movie.Title}</h2>

        <p>
          <b>Year:</b> {movie.Year}
        </p>

        <button
          className="details-btn"
          onClick={() => setSelectedMovie(movie)}
        >
          View Details
        </button>

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