from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from datetime import datetime

from app.database.connection import Base


class Collection(Base):

    __tablename__ = "collections"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    name = Column(
        String,
        nullable=False
    )

    description = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )