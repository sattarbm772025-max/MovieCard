from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import requests
import os

from dotenv import load_dotenv

from app.database.connection import SessionLocal
from app.models.search_history import SearchHistory

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
    db: Session = Depends(get_db)
):

    url = (
        f"https://www.omdbapi.com/"
        f"?apikey={OMDB_API_KEY}"
        f"&s={title}"
    )

    response = requests.get(url)

    # Save Search History

    history = SearchHistory(
        keyword=title,
        user_id=1
    )

    db.add(history)

    db.commit()

    return response.json()


@router.get("/movies/{imdb_id}")
def get_movie(imdb_id: str):

    url = (
        f"https://www.omdbapi.com/"
        f"?apikey={OMDB_API_KEY}"
        f"&i={imdb_id}"
    )

    response = requests.get(url)

    return response.json()