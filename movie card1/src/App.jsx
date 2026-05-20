import { useState } from "react";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import MovieModal from "./components/MovieModal";
import "./App.css";

function App() {
  const moviesData = [
    {
      id: 1,
      Title: "Vikram",
      Year: "2022",
      Poster:
        "https://upload.wikimedia.org/wikipedia/en/9/93/Vikram_2022_poster.jpg",
      Genre: "Action",
      Plot:
        "A special agent investigates a drug syndicate and uncovers a hidden criminal empire.",
      imdbRating: "8.4",
    },

    {
      id: 2,
      Title: "Sita Ramam",
      Year: "2022",
      Poster:
        "https://upload.wikimedia.org/wikipedia/en/1/1d/Sita_Ramam.jpg",
      Genre: "Romance",
      Plot:
        "An orphan soldier's life changes after receiving a letter from a girl named Sita.",
      imdbRating: "8.6",
    },

    {
      id: 3,
      Title: "Jailer",
      Year: "2023",
      Poster:
        "https://upload.wikimedia.org/wikipedia/en/c/cb/Jailer_2023_Tamil_film_poster.jpg",
      Genre: "Thriller",
      Plot:
        "A retired jailer goes on a mission after his son goes missing.",
      imdbRating: "7.5",
    },
  ];

  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const filteredMovies = moviesData.filter((movie) =>
    movie.Title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <div className="top-bar">
        <h1>🎬 Movie Explorer</h1>

        <button
          className="toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <SearchBar search={search} setSearch={setSearch} />

      <div className="movie-container">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              setSelectedMovie={setSelectedMovie}
            />
          ))
        ) : (
          <h2>No movies found</h2>
        )}
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          closeModal={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;