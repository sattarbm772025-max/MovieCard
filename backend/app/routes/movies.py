from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

import requests
import os

from dotenv import load_dotenv

from app.database.connection import SessionLocal

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

