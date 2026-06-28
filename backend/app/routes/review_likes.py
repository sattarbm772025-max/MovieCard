from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.connection import SessionLocal

from app.models.review import Review
from app.models.review_like import ReviewLike
from app.models.user import User

from app.utils.dependencies import get_current_user
from app.utils.notification_helper import create_notification

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/reviews/{review_id}/like")
def like_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    review = (
        db.query(Review)
        .filter(
            Review.id == review_id
        )
        .first()
    )

    if not review:

        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    if review.user_id == current_user.id:

        raise HTTPException(
            status_code=400,
            detail="You cannot like your own review"
        )

    existing_like = (
        db.query(ReviewLike)
        .filter(
            ReviewLike.review_id == review_id,
            ReviewLike.user_id == current_user.id
        )
        .first()
    )

    if existing_like:

        raise HTTPException(
            status_code=400,
            detail="Already liked"
        )

    like = ReviewLike(
        review_id=review_id,
        user_id=current_user.id
    )

    db.add(like)

    create_notification(
        db,
        review.user_id,
        f"{current_user.username} liked your review",
        "review_like"
    )

    db.commit()

    return {
        "message": "Review liked"
    }
