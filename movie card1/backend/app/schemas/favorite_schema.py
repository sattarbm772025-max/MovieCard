from pydantic import BaseModel

class FavoriteCreate(BaseModel):
    movie_id: str
    title: str
    poster: str