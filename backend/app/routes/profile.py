# app/routes/profile.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.user import User

router = APIRouter()

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/profile")
def get_profile(
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == 1
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
    data: dict,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == 1
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing = (
        db.query(User)
        .filter(
            User.email == data["email"],
            User.id != 1
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user.username = data["username"]
    user.email = data["email"]

    db.commit()

    return {
        "message":
        "Profile updated successfully"
    }


@router.put("/profile/change-password")
def change_password(
    data: dict,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == 1
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if len(data["new_password"]) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    user.password = data["new_password"]

    db.commit()

    return {
        "message":
        "Password changed successfully"
    }