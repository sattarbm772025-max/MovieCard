from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

OMDB_API_KEY = os.getenv("OMDB_API_KEY")

# Search Movies
@router.get("/movies/search")
def search_movies(title: str):

    url = f"https://www.omdbapi.com/?apikey={OMDB_API_KEY}&s={title}"

    response = requests.get(url)

    return response.json()


# Movie Details
@router.get("/movies/{imdb_id}")
def get_movie(imdb_id: str):

    url = f"https://www.omdbapi.com/?apikey={OMDB_API_KEY}&i={imdb_id}"

    response = requests.get(url)

    return response.json()