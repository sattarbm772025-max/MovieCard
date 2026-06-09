from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from datetime import datetime
from app.database.connection import Base

class ViewedMovie(Base):

    __tablename__ = "viewed_movies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    movie_id = Column(String)

    title = Column(String)

    viewed_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )