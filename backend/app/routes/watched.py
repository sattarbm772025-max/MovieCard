from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.user import User
from app.models.watchlist import Watchlist
from app.models.watched_movie import WatchedMovie
from app.schemas.watchlist_schema import WatchlistCreate
from app.schemas.watched_schema import WatchedCreate
from app.utils.dependencies import get_current_user

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def serialize_watched(movie: WatchedMovie):

    return {
        "id": movie.id,
        "movie_id": movie.movie_id,
        "title": movie.title,
        "poster": movie.poster,
        "genre": movie.genre,
        "imdb_rating": movie.imdb_rating,
        "watched_at": movie.watched_at,
        "user_id": movie.user_id,
    }


@router.post(
    "/watched",
    status_code=status.HTTP_201_CREATED
)
def add_watched(
    movie: WatchedCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    existing = (
        db.query(WatchedMovie)
        .filter(
            WatchedMovie.user_id == current_user.id,
            WatchedMovie.movie_id == movie.movie_id
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Movie already exists in watched history"
        )

    watched_movie = WatchedMovie(
        user_id=current_user.id,
        movie_id=movie.movie_id,
        title=movie.title,
        poster=movie.poster,
        genre=movie.genre,
        imdb_rating=movie.imdb_rating
    )

    watchlist_movie = (
        db.query(Watchlist)
        .filter(
            Watchlist.user_id == current_user.id,
            Watchlist.movie_id == movie.movie_id
        )
        .first()
    )

    if watchlist_movie:
        db.delete(watchlist_movie)

    db.add(watched_movie)
    db.commit()
    db.refresh(watched_movie)

    return {
        "message": "Movie marked as watched",
        "movie": serialize_watched(watched_movie)
    }


@router.get("/watched")
def get_watched(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    movies = (
        db.query(WatchedMovie)
        .filter(
            WatchedMovie.user_id == current_user.id
        )
        .order_by(
            WatchedMovie.watched_at.desc()
        )
        .all()
    )

    return [
        serialize_watched(movie)
        for movie in movies
    ]


@router.get("/watched/status/{movie_id}")
def get_watched_status(
    movie_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    existing = (
        db.query(WatchedMovie)
        .filter(
            WatchedMovie.user_id == current_user.id,
            WatchedMovie.movie_id == movie_id
        )
        .first()
    )

    return {
        "movie_id": movie_id,
        "watched": existing is not None
    }


@router.delete("/watched/{movie_id}")
def remove_watched(
    movie_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    movie = (
        db.query(WatchedMovie)
        .filter(
            WatchedMovie.user_id == current_user.id,
            WatchedMovie.movie_id == movie_id
        )
        .first()
    )

    if not movie:

        raise HTTPException(
            status_code=404,
            detail="Watched movie not found"
        )

    db.delete(movie)
    db.commit()

    return {
        "message": "Movie removed from watched history"
    }


@router.post("/watched/{movie_id}/move-to-watchlist")
def move_to_watchlist(
    movie_id: str,
    payload: WatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    watched_movie = (
        db.query(WatchedMovie)
        .filter(
            WatchedMovie.user_id == current_user.id,
            WatchedMovie.movie_id == movie_id
        )
        .first()
    )

    if not watched_movie:

        raise HTTPException(
            status_code=404,
            detail="Watched movie not found"
        )

    existing_watchlist = (
        db.query(Watchlist)
        .filter(
            Watchlist.user_id == current_user.id,
            Watchlist.movie_id == movie_id
        )
        .first()
    )

    if not existing_watchlist:

        db.add(
            Watchlist(
                user_id=current_user.id,
                movie_id=payload.movie_id,
                title=payload.title,
                poster=payload.poster,
                genre=payload.genre
            )
        )

    db.delete(watched_movie)
    db.commit()

    return {
        "message": "Movie moved back to watchlist"
    }
