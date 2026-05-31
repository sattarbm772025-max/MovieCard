from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):

    movie_id: str

    review: str

    rating: int = Field(
        ge=1,
        le=5
    )