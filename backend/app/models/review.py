from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    ForeignKey
)

from datetime import datetime

from app.database.connection import Base

class Review(Base):

    __tablename__ = "reviews"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    movie_id = Column(String)

    movie_title = Column(String)

    review = Column(String)

    rating = Column(Integer)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
