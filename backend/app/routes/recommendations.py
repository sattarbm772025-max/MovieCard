from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.services.recommendation_service import generate_recommendations

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/recommendations")
def recommendations(
    db: Session = Depends(get_db)
):
    movies = generate_recommendations(
        db=db,
        user_id=1
    )

    return {
        "recommended_movies": movies
    }