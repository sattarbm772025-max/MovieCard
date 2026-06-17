from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import SessionLocal

from app.models.user import User
from app.models.review import Review
from app.models.favorite import Favorite
from app.models.search_history import SearchHistory

from app.utils.dependencies import get_current_user

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def check_admin(
    current_user: User
):

    if not current_user.is_admin:

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


@router.get("/admin/users")
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    check_admin(current_user)

    return db.query(User).all()


@router.get("/admin/reviews")
def get_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    check_admin(current_user)

    return db.query(Review).all()


@router.delete("/admin/reviews/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    check_admin(current_user)

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

    db.delete(review)

    db.commit()

    return {
        "message":
        "Review deleted successfully"
    }


@router.get("/admin/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    check_admin(current_user)

    total_users = (
        db.query(User)
        .count()
    )

    total_reviews = (
        db.query(Review)
        .count()
    )

    total_favorites = (
        db.query(Favorite)
        .count()
    )

    searched = (
        db.query(
            SearchHistory.keyword,
            func.count(
                SearchHistory.keyword
            ).label("count")
        )
        .group_by(
            SearchHistory.keyword
        )
        .order_by(
            func.count(
                SearchHistory.keyword
            ).desc()
        )
        .first()
    )

    return {

        "total_users":
        total_users,

        "total_reviews":
        total_reviews,

        "total_favorites":
        total_favorites,

        "most_searched_movie":
        searched.keyword
        if searched
        else "N/A"
    }