from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.connection import Base


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    message = Column(
        String,
        nullable=False
    )

    type = Column(
        String,
        nullable=False
    )

    is_read = Column(
        Boolean,
        default=False
    )

    user = relationship(
        "User",
        backref="notifications"
    )