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
from app.schemas.review_schema import ReviewCreate

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ADD REVIEW

@router.post(
    "/reviews",
    status_code=status.HTTP_201_CREATED
)
def add_review(
    review: ReviewCreate,
    db: Session = Depends(get_db)
):

    # Rating Validation

    if review.rating < 1 or review.rating > 5:

        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )

    # Empty Review Validation

    if not review.review.strip():

        raise HTTPException(
            status_code=400,
            detail="Review cannot be empty"
        )

    new_review = Review(
        movie_id=review.movie_id,
        review=review.review,
        rating=review.rating,
        user_id=1
    )

    db.add(new_review)

    db.commit()

    db.refresh(new_review)

    return {
        "message": "Review added successfully",
        "review": new_review
    }


# GET REVIEWS WITH PAGINATION

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

    return reviews


# UPDATE REVIEW

@router.put("/reviews/{review_id}")
def update_review(
    review_id: int,
    review_data: ReviewCreate,
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

    # Owner Validation

    if review.user_id != 1:

        raise HTTPException(
            status_code=403,
            detail="You can only edit your own review"
        )

    # Rating Validation

    if review_data.rating < 1 or review_data.rating > 5:

        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )

    # Empty Review Validation

    if not review_data.review.strip():

        raise HTTPException(
            status_code=400,
            detail="Review cannot be empty"
        )

    review.review = review_data.review
    review.rating = review_data.rating

    db.commit()

    db.refresh(review)

    return {
        "message": "Review updated successfully",
        "review": review
    }


# DELETE REVIEW

@router.delete("/reviews/{review_id}")
def delete_review(
    review_id: int,
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

    # Owner Validation

    if review.user_id != 1:

        raise HTTPException(
            status_code=403,
            detail="You can only delete your own review"
        )

    db.delete(review)

    db.commit()

    return {
        "message": "Review deleted successfully"
    }


# AVERAGE RATING (BONUS)

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

    return {
        "movie_id": movie_id,
        "average_rating": round(avg, 2) if avg else 0
    }