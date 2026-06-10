import {
  useEffect,
  useState,
} from "react";

function Watchlist() {

  const [movies, setMovies] =
    useState([]);

  const fetchWatchlist =
    async () => {

      const response =
        await fetch(
          "http://127.0.0.1:8000/watchlist"
        );

      const data =
        await response.json();

      setMovies(data);
    };

  useEffect(() => {

    fetchWatchlist();

  }, []);

  const removeMovie =
    async (movieId) => {

      await fetch(
        `http://127.0.0.1:8000/watchlist/${movieId}`,
        {
          method: "DELETE",
        }
      );

      fetchWatchlist();
    };

  if (movies.length === 0) {

    return (
      <h2>
        Your watchlist is empty.
        Start adding movies to watch later.
      </h2>
    );
  }

  return (
    <div>

      <h1>
        My Watchlist
      </h1>

      {movies.map((movie) => (

        <div
          key={movie.movie_id}
        >

          <img
            src={movie.poster}
            width="120"
          />

          <h3>
            {movie.title}
          </h3>

          <p>
            {movie.genre}
          </p>

          <button
            onClick={() =>
              removeMovie(
                movie.movie_id
              )
            }
          >
            Remove
          </button>

        </div>
      ))}

    </div>
  );
}

export default Watchlist;