import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";

import "../styles/Home.css";

function Home() {

  const [movies, setMovies] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("batman");

  const [genre, setGenre] =
    useState("All");

  // FETCH MOVIES

  const fetchMovies = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `http://127.0.0.1:8000/movies/search?title=${search}`
      );

      const data = await response.json();

      // GET FULL DETAILS

      const movieArray = data.Search
        ? await Promise.all(

            data.Search.map(async (movie) => {

              const detailsResponse =
                await fetch(
                  `http://127.0.0.1:8000/movies/${movie.imdbID}`
                );

              const details =
                await detailsResponse.json();

              return {

                id: movie.imdbID,

                title: movie.Title,

                poster:
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/300x450",

                genre:
                  details.Genre || "Unknown",

                rating:
                  details.imdbRating || "N/A",

                story:
                  details.Plot ||
                  "No description available",
              };
            })

          )
        : [];

      setMovies(movieArray);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // INITIAL FETCH

  useEffect(() => {

    fetchMovies();

  }, []);

  // FILTER MOVIES

  const filteredMovies =
    movies.filter((movie) => {

      if (genre === "All")
        return true;

      return movie.genre
        ?.toLowerCase()
        .includes(
          genre.toLowerCase()
        );
    });

  return (
    <div className="home">

      {/* NAVBAR */}

      <Navbar />

      {/* SEARCH SECTION */}

      <div className="search-section">

        {/* SEARCH INPUT */}

        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* FILTER */}

        <select
          value={genre}
          onChange={(e) =>
            setGenre(e.target.value)
          }
        >

          <option value="All">
            All Genres
          </option>

          <option value="Action">
            Action
          </option>

          <option value="Comedy">
            Comedy
          </option>

          <option value="Drama">
            Drama
          </option>

          <option value="Adventure">
            Adventure
          </option>

          <option value="Sci-Fi">
            Sci-Fi
          </option>

          <option value="Romance">
            Romance
          </option>

          <option value="Animation">
            Animation
          </option>

          <option value="Thriller">
            Thriller
          </option>

        </select>

        {/* SEARCH BUTTON */}

        <button
          className="search-btn"
          onClick={fetchMovies}
        >
          Search
        </button>

      </div>

      {/* LOADER */}

      {loading ? (

        <Loader />

      ) : (

        <div className="movies-grid">

          {filteredMovies.map(
            (movie) => (

              <MovieCard
                key={movie.id}
                movie={movie}
              />

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Home;