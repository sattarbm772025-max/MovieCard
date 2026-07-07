from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)

from app.database.connection import Base


class UserPreference(Base):

    __tablename__ = "user_preferences"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "genre",
            name="uq_user_preference_genre"
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    genre = Column(
        String,
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
