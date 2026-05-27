from fastapi import APIRouter
from app.services.omdb_service import (
    search_movies,
    get_movie
)

router = APIRouter()

@router.get("/movies/search")
def search(title: str):

    return search_movies(title)

@router.get("/movies/{imdb_id}")
def movie_details(imdb_id: str):

    return get_movie(imdb_id)