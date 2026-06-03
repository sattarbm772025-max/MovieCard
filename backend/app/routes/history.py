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

    history = (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == 1
        )
        .order_by(
            SearchHistory.searched_at.desc()
        )
        .limit(10)
        .all()
    )

    return {
        "success": True,
        "data": [
            {
                "keyword": item.keyword,
                "searched_at": item.searched_at
            }
            for item in history
        ]
    }