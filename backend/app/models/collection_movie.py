from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    UniqueConstraint
)

from app.database.connection import Base


class CollectionMovie(Base):

    __tablename__ = "collection_movies"
    __table_args__ = (
        UniqueConstraint(
            "collection_id",
            "movie_id",
            name="uq_collection_movie"
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    collection_id = Column(
        Integer,
        ForeignKey("collections.id")
    )

    movie_id = Column(
        String,
        nullable=False
    )

    title = Column(String)

    poster = Column(String)

    genre = Column(String)

    year = Column(String)

    imdb_rating = Column(String)

    runtime = Column(String)
