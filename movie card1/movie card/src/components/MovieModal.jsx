import "./MovieModal.css";

function MovieModal({ movie, closeModal }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={closeModal}>
          ✖
        </button>

        <img src={movie.Poster} alt={movie.Title} />

        <div className="modal-content">
          <h2>{movie.Title}</h2>

          <p>
            <b>Genre:</b> {movie.Genre}
          </p>

          <p>
            <b>IMDb Rating:</b> ⭐ {movie.imdbRating}
          </p>

          <p>
            <b>Plot:</b> {movie.Plot}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;