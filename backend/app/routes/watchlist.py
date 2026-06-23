from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.watchlist import Watchlist
from app.models.user import User
from app.schemas.watchlist_schema import WatchlistCreate
from app.utils.dependencies import get_current_user

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/watchlist")
def add_watchlist(
    movie: WatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    existing = (
        db.query(Watchlist)
        .filter(
            Watchlist.user_id == current_user.id,
            Watchlist.movie_id == movie.movie_id
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Movie already exists in watchlist"
        )

    watch = Watchlist(
        user_id=current_user.id,
        movie_id=movie.movie_id,
        title=movie.title,
        poster=movie.poster,
        genre=movie.genre
    )

    db.add(watch)
    db.commit()

    return {
        "message": "Movie added to watchlist"
    }


@router.get("/watchlist")
def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    movies = (
        db.query(Watchlist)
        .filter(
            Watchlist.user_id == current_user.id
        )
        .all()
    )

    return movies


@router.delete("/watchlist/{movie_id}")
def remove_watchlist(
    movie_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    movie = (
        db.query(Watchlist)
        .filter(
            Watchlist.user_id == current_user.id,
            Watchlist.movie_id == movie_id
        )
        .first()
    )

    if not movie:

        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    db.delete(movie)
    db.commit()

    return {
        "message": "Movie removed"
    }