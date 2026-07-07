from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import SessionLocal
from app.models.user import User
from app.models.user_preference import UserPreference
from app.schemas.preference_schema import PreferenceCreate
from app.utils.dependencies import get_current_user

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def serialize_preference(preference: UserPreference):

    return {
        "id": preference.id,
        "genre": preference.genre,
        "user_id": preference.user_id,
    }


@router.get("/preferences")
def get_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    preferences = (
        db.query(UserPreference)
        .filter(
            UserPreference.user_id == current_user.id
        )
        .order_by(UserPreference.genre.asc())
        .all()
    )

    return [
        serialize_preference(preference)
        for preference in preferences
    ]


@router.post(
    "/preferences",
    status_code=status.HTTP_201_CREATED
)
def add_preference(
    preference: PreferenceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    genre = preference.genre.strip()

    if not genre:

        raise HTTPException(
            status_code=400,
            detail="Genre is required"
        )

    existing = (
        db.query(UserPreference)
        .filter(
            UserPreference.user_id == current_user.id,
            func.lower(UserPreference.genre) == genre.lower()
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Genre preference already exists"
        )

    new_preference = UserPreference(
        user_id=current_user.id,
        genre=genre
    )

    db.add(new_preference)
    db.commit()
    db.refresh(new_preference)

    return {
        "message": "Genre preference added",
        "preference": serialize_preference(new_preference)
    }


@router.delete("/preferences/{preference_id}")
def remove_preference(
    preference_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    preference = (
        db.query(UserPreference)
        .filter(
            UserPreference.id == preference_id,
            UserPreference.user_id == current_user.id
        )
        .first()
    )

    if not preference:

        raise HTTPException(
            status_code=404,
            detail="Genre preference not found"
        )

    db.delete(preference)
    db.commit()

    return {
        "message": "Genre preference removed"
    }
