from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean
)

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

    is_admin = Column(
        Boolean,
        default=False
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

    collections = relationship(
        "Collection",
        backref="user",
        cascade="all, delete"
    )

    preferences = relationship(
        "UserPreference",
        backref="user",
        cascade="all, delete"
    )


# Import relationship targets so SQLAlchemy can resolve string-based
# relationships even when a route imports User before app.main imports models.
from app.models import favorite  # noqa: E402, F401
from app.models import review  # noqa: E402, F401
from app.models import search_history  # noqa: E402, F401
from app.models import viewed_movie  # noqa: E402, F401
from app.models import watchlist  # noqa: E402, F401
from app.models import collection  # noqa: E402, F401
from app.models import user_preference  # noqa: E402, F401
