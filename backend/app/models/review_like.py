from sqlalchemy import (
    Column,
    Integer,
    ForeignKey
)

from app.database.connection import Base



class ReviewLike(Base):

    __tablename__ = "review_likes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    review_id = Column(
        Integer,
        ForeignKey("reviews.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    
