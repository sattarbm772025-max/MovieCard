from pydantic import BaseModel


class CollectionCreate(BaseModel):

    name: str

    description: str = ""


class CollectionMovieCreate(BaseModel):

    movie_id: str

    title: str

    poster: str = ""

    genre: str = ""