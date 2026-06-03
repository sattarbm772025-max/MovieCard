from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal

from app.models.favorite import Favorite
from app.models.search_history import SearchHistory

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db)
):

    user_id = 1

    total_favorites = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == user_id
        )
        .count()
    )

    total_searches = (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == user_id
        )
        .count()
    )

    recent_searches = (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == user_id
        )
        .order_by(
            SearchHistory.searched_at.desc()
        )
        .limit(3)
        .all()
    )

    return {
        "total_favorites": total_favorites,
        "total_searches": total_searches,
        "recent_searches": [
            item.keyword
            for item in recent_searches
        ]
    }