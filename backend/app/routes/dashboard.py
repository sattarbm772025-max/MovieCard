from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal

from app.models.favorite import Favorite
from app.models.search_history import SearchHistory
from app.models.user import User
from app.utils.dependencies import get_current_user

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/dashboard")
def dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    total_favorites = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id
        )
        .count()
    )

    total_searches = (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == current_user.id
        )
        .count()
    )

    recent_searches = (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == current_user.id
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
