from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.connection import Base

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )

    favorites = relationship(
        "Favorite",
        backref="user",
        cascade="all, delete"
    )

    reviews = relationship(
        "Review",
        backref="user",
        cascade="all, delete"
    )

    search_history = relationship(
        "SearchHistory",
        backref="user",
        cascade="all, delete"
    )

    viewed_movies = relationship(
        "ViewedMovie",
        backref="user",
        cascade="all, delete"
    )

    watchlist = relationship(
        "Watchlist",
        backref="user",
        cascade="all, delete"
    )