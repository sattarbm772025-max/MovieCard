from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session
from sqlalchemy import func

import requests
import os

from dotenv import load_dotenv

from app.database.connection import SessionLocal

from app.models.review import Review
from app.models.search_history import SearchHistory
from app.models.user import User
from app.utils.dependencies import get_current_user

load_dotenv()

router = APIRouter()

OMDB_API_KEY = os.getenv("OMDB_API_KEY")


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/movies/search")
def search_movies(
    title: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if not title or not title.strip():

        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "message": "Invalid request"
            }
        )

    last_search = (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == current_user.id
        )
        .order_by(
            SearchHistory.searched_at.desc()
        )
        .first()
    )

    if (
        not last_search
        or last_search.keyword.lower()
        != title.lower()
    ):

        history = SearchHistory(
            keyword=title,
            user_id=current_user.id
        )

        db.add(history)
        db.commit()

    url = (
        f"https://www.omdbapi.com/"
        f"?apikey={OMDB_API_KEY}"
        f"&s={title}"
    )

    response = requests.get(url)

    return response.json()


def get_review_stats(
    movie_id: str,
    db: Session
):

    avg = (
        db.query(
            func.avg(
                Review.rating
            )
        )
        .filter(
            Review.movie_id == movie_id
        )
        .scalar()
    )

    total_reviews = (
        db.query(Review)
        .filter(
            Review.movie_id == movie_id
        )
        .count()
    )

    return {
        "average_rating": round(avg, 2) if avg else 0,
        "total_reviews": total_reviews,
    }


def build_compare_movie(
    movie_id: str,
    db: Session
):

    url = (
        f"https://www.omdbapi.com/"
        f"?apikey={OMDB_API_KEY}"
        f"&i={movie_id}"
    )

    response = requests.get(url)
    movie = response.json()

    if movie.get("Response") == "False":

        raise HTTPException(
            status_code=404,
            detail=f"Movie not found: {movie_id}"
        )

    stats = get_review_stats(movie_id, db)

    imdb_rating = movie.get("imdbRating")

    return {
        "movie_id": movie_id,
        "poster": movie.get("Poster"),
        "title": movie.get("Title"),
        "release_year": movie.get("Year"),
        "genre": movie.get("Genre"),
        "runtime": movie.get("Runtime"),
        "director": movie.get("Director"),
        "cast": movie.get("Actors"),
        "imdb_rating": (
            float(imdb_rating)
            if imdb_rating not in [None, "N/A"]
            else 0
        ),
        "user_average_rating": stats["average_rating"],
        "total_reviews": stats["total_reviews"],
        "plot": movie.get("Plot"),
    }


def compare_message(
    first_movie,
    second_movie,
    key,
    label
):

    first_value = first_movie[key]
    second_value = second_movie[key]

    if first_value > second_value:

        return (
            f"{first_movie['title']} has a higher "
            f"{label} than {second_movie['title']}."
        )

    if second_value > first_value:

        return (
            f"{second_movie['title']} has a higher "
            f"{label} than {first_movie['title']}."
        )

    return (
        f"{first_movie['title']} and "
        f"{second_movie['title']} have the same {label}."
    )


def highest_compare_message(
    movies,
    key,
    label
):

    values = [
        movie[key]
        for movie in movies
    ]

    best_value = max(values)

    best_movies = [
        movie["title"]
        for movie in movies
        if movie[key] == best_value
    ]

    if len(best_movies) == len(movies):

        return (
            f"All selected movies have the same {label}."
        )

    if len(best_movies) > 1:

        return (
            f"{', '.join(best_movies)} are tied for the highest {label}."
        )

    return (
        f"{best_movies[0]} has the highest {label}."
    )


@router.get("/movies/compare")
def compare_movies(
    movie1: str,
    movie2: str,
    movie3: str | None = None,
    db: Session = Depends(get_db)
):

    movie_ids = [
        movie_id
        for movie_id in [movie1, movie2, movie3]
        if movie_id
    ]

    if len(movie_ids) < 2:

        raise HTTPException(
            status_code=400,
            detail="At least two movie ids are required"
        )

    if len(set(movie_ids)) != len(movie_ids):

        raise HTTPException(
            status_code=400,
            detail="Please select different movies"
        )

    movies = [
        build_compare_movie(
            movie_id,
            db
        )
        for movie_id in movie_ids
    ]

    return {
        "movies": movies,
        "summary": [
            highest_compare_message(
                movies,
                "imdb_rating",
                "IMDb rating"
            ),
            highest_compare_message(
                movies,
                "user_average_rating",
                "user rating"
            ),
            highest_compare_message(
                movies,
                "total_reviews",
                "review count"
            ),
        ],
    }


@router.get("/movies/{imdb_id}")
def get_movie(
    imdb_id: str
):

    if not imdb_id:

        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "message": "Invalid request"
            }
        )

    url = (
        f"https://www.omdbapi.com/"
        f"?apikey={OMDB_API_KEY}"
        f"&i={imdb_id}"
    )

    response = requests.get(url)

    return response.json()

