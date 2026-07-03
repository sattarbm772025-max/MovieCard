from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)

from app.database.connection import Base


class WatchedMovie(Base):

    __tablename__ = "watched_movies"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "movie_id",
            name="uq_watched_user_movie"
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    movie_id = Column(
        String,
        nullable=False
    )

    title = Column(String)

    poster = Column(String)

    genre = Column(String)

    imdb_rating = Column(String)

    watched_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
