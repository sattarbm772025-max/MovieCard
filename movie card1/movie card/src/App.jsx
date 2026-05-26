import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import Filter from "./components/Filter";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [search, setSearch] = useState("batman");

  const [genre, setGenre] = useState("All");

  const [darkMode, setDarkMode] = useState(true);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // FETCH MOVIES

  const fetchMovies = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await fetch(
        `http://127.0.0.1:8000/movies/search?title=${search}`
      );

      const data = await response.json();

      console.log(data);

      if (data.Search) {
        const formattedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const detailsResponse = await fetch(
              `http://127.0.0.1:8000/movies/${movie.imdbID}`
            );

            const details = await detailsResponse.json();

            return {
              id: movie.imdbID,

              title: movie.Title,

              genre: details.Genre
                ? details.Genre.split(",")[0]
                : "Unknown",

              rating: details.imdbRating || "N/A",

              description:
                details.Plot || "No description available",

              image:
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/300x450",
            };
          })
        );

        setMovies(formattedMovies);
      } else {
        setMovies([]);
        setError("No movies found");
      }
    } catch (err) {
      console.log(err);

      setError("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  // FETCH FAVORITES

  const fetchFavorites = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/favorites"
      );

      const data = await response.json();

      setFavorites(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ADD FAVORITE

  const addFavorite = async (movie) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/favorites",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            movie_id: movie.id,
            title: movie.title,
            poster: movie.image,
            genre: movie.genre,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      fetchFavorites();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE FAVORITE

  const deleteFavorite = async (movieId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/favorites/${movieId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      alert(data.message);

      fetchFavorites();
    } catch (error) {
      console.log(error);
    }
  };

  // INITIAL LOAD

  useEffect(() => {
    fetchMovies();

    fetchFavorites();
  }, []);

  // FILTER MOVIES

  const filteredMovies = movies.filter((movie) => {
    if (genre === "All") return true;

    return movie.genre
      .toLowerCase()
      .includes(genre.toLowerCase());
  });

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* HEADER */}

      <div className="top-bar">
        <h1>🎬 Movie Recommendation App</h1>

        <button
          className="toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* SEARCH + FILTER */}

      <div className="controls">
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <Filter
          genre={genre}
          setGenre={setGenre}
        />

        <button
          className="search-btn"
          onClick={fetchMovies}
        >
          Search
        </button>
      </div>

      {/* LOADING */}

      {loading && (
        <h2 className="message">
          Loading movies...
        </h2>
      )}

      {/* ERROR */}

      {error && (
        <h2 className="message">
          {error}
        </h2>
      )}

      {/* MOVIES */}

      <div className="movie-container">
        {filteredMovies.map((movie) => (
          <div key={movie.id}>
            <MovieCard movie={movie} />

            <button
              className="fav-btn"
              onClick={() => addFavorite(movie)}
            >
              ❤️ Add Favorite
            </button>
          </div>
        ))}
      </div>

      {/* FAVORITES */}

      <h1 className="fav-title">
        ⭐ Favorite Movies
      </h1>

      <div className="movie-container">
        {favorites.map((movie) => (
          <div
            className="favorite-card"
            key={movie.movie_id}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="favorite-image"
            />

            <h3>{movie.title}</h3>

            <p>{movie.genre}</p>

            <button
              className="delete-btn"
              onClick={() =>
                deleteFavorite(movie.movie_id)
              }
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;