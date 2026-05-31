from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.search_history import SearchHistory

router = APIRouter()

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

@router.get("/history")
def get_history(
    db: Session = Depends(get_db)
):

    return (
        db.query(SearchHistory)
        .order_by(
            SearchHistory.searched_at.desc()
        )
        .limit(20)
        .all()
    )