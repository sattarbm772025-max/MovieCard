from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):

    movie_id: str

    movie_title: str = ""

    review: str

    rating: int = Field(
        ge=1,
        le=5
    )
