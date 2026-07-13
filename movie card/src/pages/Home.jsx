import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import API from "../api/axios";

import "../styles/Home.css";

function Home() {

  const [movies, setMovies] = useState([]);
  const [recommended, setRecommended] =
    useState([]);
  const [loading, setLoading] =
    useState(false);
  const [search, setSearch] =
    useState("batman");
  const [activeSearch, setActiveSearch] =
    useState("batman");
  const [genre, setGenre] =
    useState("All");

  const fetchRecommendations =
    useCallback(async () => {

      try {

        const response =
          await API.get("/recommendations");

        setRecommended(
          response.data.recommended_movies || []
        );

      } catch (error) {

        toast.error(
          error.response?.data?.detail ||
          "Failed to load recommendations"
        );
      }
    }, []);

  const fetchMovies =
    useCallback(async (query) => {

      const title =
        query.trim();

      if (!title) {

        toast.error(
          "Please enter a movie title"
        );

        return;
      }

      try {

        setLoading(true);

        const response = await API.get(
          `/movies/search?title=${encodeURIComponent(title)}`
        );

        const data = response.data;

        const movieArray = data.Search
          ? await Promise.all(
              data.Search.map(
                async (movie) => {

                  const detailsResponse =
                    await API.get(
                      `/movies/${movie.imdbID}`
                    );

                  const details =
                    detailsResponse.data;

                  return {
                    id: movie.imdbID,
                    title: movie.Title,
                    poster:
                      movie.Poster !== "N/A"
                        ? movie.Poster
                        : "https://via.placeholder.com/300x450",
                    genre:
                      details.Genre ||
                      "Unknown",
                    rating:
                      details.imdbRating ||
                      "N/A",
                    story:
                      details.Plot ||
                      "No description available",
                  };
                }
              )
            )
          : [];

        setMovies(movieArray);
        setActiveSearch(title);
        fetchRecommendations();

      } catch (error) {

        toast.error(
          error.response?.data?.detail ||
          "Failed to search movies"
        );

      } finally {

        setLoading(false);
      }
    }, [fetchRecommendations]);

  useEffect(() => {

    fetchMovies("batman");

  }, [fetchMovies]);

  const handleSearch = () => {

    fetchMovies(search);
  };

  const filteredMovies =
    movies.filter((movie) => {

      if (genre === "All") {
        return true;
      }

      return movie.genre
        ?.toLowerCase()
        .includes(
          genre.toLowerCase()
        );
    });

  const actionMovies =
    filteredMovies.filter((movie) =>
      movie.genre
        ?.toLowerCase()
        .includes("action")
    );

  const dramaMovies =
    filteredMovies.filter((movie) =>
      movie.genre
        ?.toLowerCase()
        .includes("drama")
    );

  const renderMovieRow = (
    title,
    list,
    subtitle
  ) => (
    <section className="movie-row">
      <h2>{title}</h2>

      {subtitle && (
        <p className="movie-row-subtitle">
          {subtitle}
        </p>
      )}

      <div className="movie-list">
        {list.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="home">

      <Navbar />

      <main className="home-container">
        <div
          id="search"
          className="search-section"
        >
          <div className="search-box smart-search-box">
            <span className="search-icon">
              {"\uD83D\uDD0E"}
            </span>

            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="genre-box smart-genre-box">
            <span className="search-icon">
              {"\uD83C\uDFAD"}
            </span>

            <select
              value={genre}
              onChange={(e) =>
                setGenre(e.target.value)
              }
            >
              <option value="All">All</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Adventure">Adventure</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Romance">Romance</option>
              <option value="Animation">Animation</option>
              <option value="Thriller">Thriller</option>
            </select>
          </div>

          <button
            className="search-btn"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {recommended.length > 0 && (
          <section className="movie-row recommended-row">
            <h2>Recommended Movies</h2>
            <p className="movie-row-subtitle">
              Personalized picks from your activity.
            </p>

            <div className="movie-list">
              {recommended.map((movie) => (
                <div key={movie.id}>
                  <MovieCard movie={movie} />
                  <p className="recommendation-reason">
                    {movie.reason}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {loading ? (
          <Loader />
        ) : (
          <>
            {renderMovieRow(
              "Search Results",
              filteredMovies,
              `${filteredMovies.length} movies found for "${activeSearch}".`
            )}

            {actionMovies.length > 0 &&
              renderMovieRow(
                "Action Movies",
                actionMovies
              )}

            {dramaMovies.length > 0 &&
              renderMovieRow(
                "Drama Movies",
                dramaMovies
              )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Home;
