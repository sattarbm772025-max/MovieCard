from pydantic import BaseModel


class WatchlistCreate(BaseModel):

    movie_id: str

    title: str

    poster: str = ""

    genre: str = ""