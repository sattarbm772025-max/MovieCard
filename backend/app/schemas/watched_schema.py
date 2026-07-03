from pydantic import BaseModel


class WatchedCreate(BaseModel):

    movie_id: str

    title: str

    poster: str = ""

    genre: str = ""

    imdb_rating: str = ""
