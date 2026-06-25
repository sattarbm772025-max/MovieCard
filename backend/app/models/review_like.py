from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    true
)

from app.database.connection import Base



class ReviewLike(Base):

    __tablename__ = "review_likes"

    id = Column(
        Integer,
        primary_key=True,
        index=true
    )

    review_id = Column(
        Integer,
        ForeignKey("reviews.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    
