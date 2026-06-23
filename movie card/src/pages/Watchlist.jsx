import {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";
import Navbar from "../components/Navbar";

function Watchlist() {

  const [movies, setMovies] =
    useState([]);

  const fetchWatchlist =
    async () => {

      const response =
        await API.get("/watchlist");

      setMovies(response.data);
    };

  useEffect(() => {

    fetchWatchlist();

  }, []);

  const removeMovie =
    async (movieId) => {

      await API.delete(
        `/watchlist/${movieId}`
      );

      fetchWatchlist();
    };

  if (movies.length === 0) {

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "white",
        }}
      >
        <Navbar />
        <h2
          style={{
            textAlign: "center",
            marginTop: "80px",
          }}
        >
          📺 Your watchlist is empty.
          Start adding movies to watch later.
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
      }}
    >

      <Navbar />

      <h1
        style={{
          textAlign: "center",
          padding: "30px 20px",
          fontSize: "42px",
        }}
      >
        📺 My Watchlist
      </h1>

      <div
        style={{
          width: "92%",
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          paddingBottom: "50px",
        }}
      >

        {movies.map((movie) => (

          <div
            key={movie.movie_id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              background: "#18233a",
              borderRadius: "14px",
              padding: "14px",
              boxShadow:
                "0 5px 15px rgba(0,0,0,0.35)",
            }}
          >

            <img
              src={
                movie.poster &&
                movie.poster !== "N/A"
                  ? movie.poster
                  : "https://via.placeholder.com/120x170"
              }
              width="120"
              height="170"
              alt={movie.title}
              style={{
                borderRadius: "10px",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />

            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >

              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: "24px",
                }}
              >
                🎬 {movie.title}
              </h3>

              <p
                style={{
                  color: "#ffd60a",
                  margin: 0,
                }}
              >
                {movie.genre || "Genre not available"}
              </p>

            </div>

            <button
              style={{
                background: "#ffd60a",
                border: "none",
                borderRadius: "10px",
                padding: "10px 18px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
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

    </div>
  );
}

export default Watchlist;
