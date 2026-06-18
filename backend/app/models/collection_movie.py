from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database.connection import Base


class CollectionMovie(Base):

    __tablename__ = "collection_movies"

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