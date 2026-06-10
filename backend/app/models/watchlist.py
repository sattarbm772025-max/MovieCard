from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from datetime import datetime

from app.database.connection import Base


class Watchlist(Base):

    __tablename__ = "watchlist"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    movie_id = Column(
        String,
        nullable=False
    )

    title = Column(String)

    poster = Column(String)

    genre = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )