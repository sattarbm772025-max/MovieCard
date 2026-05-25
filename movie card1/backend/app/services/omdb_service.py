import requests
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("OMDB_API_KEY")

def search_movies(title):

    url = (
        f"https://www.omdbapi.com/"
        f"?apikey={API_KEY}&s={title}"
    )

    response = requests.get(url)

    return response.json()

def get_movie(imdb_id):

    url = (
        f"https://www.omdbapi.com/"
        f"?apikey={API_KEY}&i={imdb_id}"
    )

    response = requests.get(url)

    return response.json()