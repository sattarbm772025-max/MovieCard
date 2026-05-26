from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database.connection import Base

class Favorite(Base):

    __tablename__ = "favorites"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    movie_id = Column(String)

    title = Column(String)

    poster = Column(String)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )