from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import SessionLocal
from app.models.review import Review
from app.models.review_like import ReviewLike
from app.models.user import User
from app.schemas.review_schema import ReviewCreate
from app.utils.dependencies import get_current_user

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def review_like_count(
    db: Session,
    review_id: int
):

    return (
        db.query(ReviewLike)
        .filter(ReviewLike.review_id == review_id)
        .count()
    )


def serialize_review(
    review: Review,
    db: Session
):

    return {
        "id": review.id,
        "movie_id": review.movie_id,
        "movie_title": review.movie_title,
        "review": review.review,
        "rating": review.rating,
        "created_at": review.created_at,
        "user_id": review.user_id,
        "like_count": review_like_count(db, review.id),
    }


@router.post(
    "/reviews",
    status_code=status.HTTP_201_CREATED
)
def add_review(
    review: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if review.rating < 1 or review.rating > 5:

        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )

    if not review.review.strip():

        raise HTTPException(
            status_code=400,
            detail="Review cannot be empty"
        )

    existing_review = (
        db.query(Review)
        .filter(
            Review.movie_id == review.movie_id,
            Review.user_id == current_user.id
        )
        .first()
    )

    if existing_review:

        raise HTTPException(
            status_code=400,
            detail="You already reviewed this movie"
        )

    new_review = Review(
        movie_id=review.movie_id,
        movie_title=review.movie_title,
        review=review.review,
        rating=review.rating,
        user_id=current_user.id
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return {
        "message": "Review added successfully",
        "review": serialize_review(new_review, db)
    }


@router.get("/reviews/average/{movie_id}")
def average_rating(
    movie_id: str,
    db: Session = Depends(get_db)
):

    avg = (
        db.query(
            func.avg(
                Review.rating
            )
        )
        .filter(
            Review.movie_id == movie_id
        )
        .scalar()
    )

    total_reviews = (
        db.query(Review)
        .filter(
            Review.movie_id == movie_id
        )
        .count()
    )

    return {
        "movie_id": movie_id,
        "average_rating": round(avg, 2) if avg else 0,
        "total_reviews": total_reviews
    }


@router.get("/reviews/{movie_id}")
def get_reviews(
    movie_id: str,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):

    if page < 1:
        page = 1

    if limit < 1:
        limit = 10

    offset = (page - 1) * limit

    reviews = (
        db.query(Review)
        .filter(
            Review.movie_id == movie_id
        )
        .offset(offset)
        .limit(limit)
        .all()
    )

    return [
        serialize_review(review, db)
        for review in reviews
    ]


@router.put("/reviews/{review_id}")
def update_review(
    review_id: int,
    review_data: ReviewCreate,
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

    if review.user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="You can only edit your own review"
        )

    if review_data.rating < 1 or review_data.rating > 5:

        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )

    if not review_data.review.strip():

        raise HTTPException(
            status_code=400,
            detail="Review cannot be empty"
        )

    review.review = review_data.review
    review.rating = review_data.rating
    review.movie_title = review_data.movie_title

    db.commit()
    db.refresh(review)

    return {
        "message": "Review updated successfully",
        "review": serialize_review(review, db)
    }


@router.delete("/reviews/{review_id}")
def delete_review(
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

    if review.user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="You can only delete your own review"
        )

    (
        db.query(ReviewLike)
        .filter(ReviewLike.review_id == review_id)
        .delete()
    )

    db.delete(review)
    db.commit()

    return {
        "message": "Review deleted successfully"
    }
