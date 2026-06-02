import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import "../styles/MovieDetails.css";

function MovieDetails() {

  const { id } = useParams();

  const [movie, setMovie] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchMovie = async () => {

      try {

        const response = await fetch(
          `http://127.0.0.1:8000/movies/${id}`
        );

        const data = await response.json();

        setMovie(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

    fetchMovie();

  }, [id]);

  if (loading) {

    return (
      <>
        <Navbar />
        <h2
          style={{
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          Loading...
        </h2>
      </>
    );
  }

  return (
    <div className="details-page">

      <Navbar />

      <div className="details-container">

        <img
          src={movie.Poster}
          alt={movie.Title}
          className="details-poster"
        />

        <div className="details-content">

          <h1>{movie.Title}</h1>

          <p>
            <strong>Year:</strong>{" "}
            {movie.Year}
          </p>

          <p>
            <strong>Genre:</strong>{" "}
            {movie.Genre}
          </p>

          <p>
            <strong>IMDb Rating:</strong>{" "}
            ⭐ {movie.imdbRating}
          </p>

          <p>
            <strong>Plot:</strong>{" "}
            {movie.Plot}
          </p>

        </div>

      </div>

    </div>
  );
}

export default MovieDetails;