import { useEffect, useState } from "react";
import API from "../api/axios";
import MovieCard from "./MovieCard";

function Recommendations() {

  const [movies, setMovies] =
    useState([]);

  useEffect(() => {

    API
      .get(
        "/recommendations"
      )
      .then((res) =>
        setMovies(
          res.data.recommended_movies
        )
      );

  }, []);

  if (movies.length === 0) {

    return (
      <div>
        Start searching and adding
        favorites to get personalized
        recommendations.
      </div>
    );
  }

  return (
    <div>

      <h2>
        Recommended For You
      </h2>

      <div className="movie-grid">

        {movies.map((movie, index) => (

          <div key={index}>

            <MovieCard movie={movie} />

            <p>
              {movie.reason}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Recommendations;