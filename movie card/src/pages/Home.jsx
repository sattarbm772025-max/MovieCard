import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
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

  const [genre, setGenre] =
    useState("All");

  const fetchRecommendations =
    useCallback(async () => {

      try {

        const response =
          await API.get("/recommendations");

        const data =
          response.data;

        setRecommended(
          data.recommended_movies || []
        );

      } catch (error) {

        console.log(error);
      }
    }, []);

  const fetchMovies =
    useCallback(async () => {

      try {

        setLoading(true);

        const response = await API.get(
          `/movies/search?title=${encodeURIComponent(search)}`
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

        fetchRecommendations();

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    }, [fetchRecommendations, search]);

  useEffect(() => {

    fetchMovies();

  }, [fetchMovies]);

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

      <Navbar />

      <div className="search-section">

        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

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

        <button
          className="search-btn"
          onClick={fetchMovies}
        >
          Search
        </button>

      </div>

      <div
        style={{
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >

        <h2>
          Recommended For You
        </h2>

        {recommended.length === 0 ? (

          <p>
            Start searching and adding favorites to get personalized recommendations.
          </p>

        ) : (

          <div className="movies-grid">

            {recommended.map(
              (movie) => (

                <div key={movie.id}>

                  <MovieCard
                    movie={movie}
                  />

                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "5px",
                    }}
                  >
                    {movie.reason}
                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

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