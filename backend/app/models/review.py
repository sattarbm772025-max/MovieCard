from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database.connection import Base

class Review(Base):

    __tablename__ = "reviews"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    movie_id = Column(String)

    review = Column(String)

    rating = Column(Integer)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )