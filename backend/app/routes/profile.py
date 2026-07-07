# app/routes/profile.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from passlib.context import CryptContext
from pydantic import BaseModel

from app.database.connection import SessionLocal
from app.models.favorite import Favorite
from app.models.review import Review
from app.models.user import User
from app.models.watchlist import Watchlist
from app.models.watched_movie import WatchedMovie
from app.utils.dependencies import get_current_user

router = APIRouter()
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


class ProfileUpdate(BaseModel):

    username: str
    email: str


class PasswordUpdate(BaseModel):

    old_password: str
    new_password: str


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/profile")
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == current_user.id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email
    }


@router.put("/profile")
def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == current_user.id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not data.username.strip():
        raise HTTPException(
            status_code=400,
            detail="Username is required"
        )

    if "@" not in data.email:
        raise HTTPException(
            status_code=400,
            detail="Valid email is required"
        )

    existing = (
        db.query(User)
        .filter(
            User.email == data.email,
            User.id != current_user.id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    duplicate_username = (
        db.query(User)
        .filter(
            func.lower(User.username) == data.username.lower(),
            User.id != current_user.id
        )
        .first()
    )

    if duplicate_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    user.username = data.username.strip()
    user.email = data.email

    db.commit()

    return {
        "message":
        "Profile updated successfully"
    }


@router.put("/profile/change-password")
def change_password(
    data: PasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == current_user.id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not pwd_context.verify(
        data.old_password,
        user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect"
        )

    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    user.password = pwd_context.hash(data.new_password)

    db.commit()

    return {
        "message":
        "Password changed successfully"
    }


@router.get("/profile/stats")
def get_profile_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    watched_count = (
        db.query(WatchedMovie)
        .filter(
            WatchedMovie.user_id == current_user.id
        )
        .count()
    )

    favorites_count = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id
        )
        .count()
    )

    watchlist_count = (
        db.query(Watchlist)
        .filter(
            Watchlist.user_id == current_user.id
        )
        .count()
    )

    reviews_count = (
        db.query(Review)
        .filter(
            Review.user_id == current_user.id
        )
        .count()
    )

    return {
        "watched_count": watched_count,
        "favorites_count": favorites_count,
        "watchlist_count": watchlist_count,
        "reviews_count": reviews_count,
    }
