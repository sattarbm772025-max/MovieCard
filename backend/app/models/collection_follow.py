from sqlalchemy import (
    Column,
    Integer,
    ForeignKey
)

from app.database.connection import Base


class CollectionFollow(Base):

    __tablename__ = "collection_follows"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    collection_id = Column(
        Integer,
        ForeignKey("collections.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
    )
