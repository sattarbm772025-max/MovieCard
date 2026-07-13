from pydantic import BaseModel


class CollectionCreate(BaseModel):

    name: str

    description: str = ""

    visibility: str = "private"


class CollectionUpdate(BaseModel):

    name: str

    description: str = ""

    visibility: str = "private"


class CollectionMovieCreate(BaseModel):

    movie_id: str

    title: str

    poster: str = ""

    genre: str = ""

    year: str = ""

    imdb_rating: str = ""

    runtime: str = ""
