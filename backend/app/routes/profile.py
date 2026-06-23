# app/routes/profile.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.database.connection import SessionLocal
from app.models.user import User
from app.utils.dependencies import get_current_user

router = APIRouter()
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

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
    data: dict,
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

    existing = (
        db.query(User)
        .filter(
            User.email == data["email"],
            User.id != current_user.id
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

    if len(data["new_password"]) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    user.password = pwd_context.hash(data["new_password"])

    db.commit()

    return {
        "message":
        "Password changed successfully"
    }