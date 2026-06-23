from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.services.recommendation_service import generate_recommendations
from app.models.user import User
from app.utils.dependencies import get_current_user
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/recommendations")
def recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    movies = generate_recommendations(
        db=db,
        user_id=current_user.id
    )

    return {
        "recommended_movies": movies
    }