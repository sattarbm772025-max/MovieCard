from collections import Counter
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal

from app.models.collection import Collection
from app.models.favorite import Favorite
from app.models.review import Review
from app.models.search_history import SearchHistory
from app.models.user import User
from app.models.watchlist import Watchlist
from app.models.watched_movie import WatchedMovie
from app.utils.dependencies import get_current_user

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def month_key(date_value):

    return date_value.strftime("%Y-%m")


def month_label(date_value):

    return date_value.strftime("%b")


def last_six_months():

    today = datetime.utcnow().replace(day=1)
    months = []

    for index in range(5, -1, -1):
        month = today.month - index
        year = today.year

        while month <= 0:
            month += 12
            year -= 1

        months.append(
            datetime(year, month, 1)
        )

    return months


def watched_streak(watched_movies):

    watched_dates = {
        movie.watched_at.date()
        for movie in watched_movies
        if movie.watched_at
    }

    if not watched_dates:
        return 0

    streak = 0
    current_day = datetime.utcnow().date()

    while current_day in watched_dates:
        streak += 1
        current_day -= timedelta(days=1)

    return streak


@router.get("/dashboard")
def dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    watched_movies = (
        db.query(WatchedMovie)
        .filter(
            WatchedMovie.user_id == current_user.id
        )
        .all()
    )

    watched_count = len(watched_movies)

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

    collections_count = (
        db.query(Collection)
        .filter(
            Collection.user_id == current_user.id
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

    current_month = datetime.utcnow().strftime("%Y-%m")
    watched_this_month = sum(
        1
        for movie in watched_movies
        if movie.watched_at
        and movie.watched_at.strftime("%Y-%m") == current_month
    )

    top_genres = get_top_genres(
        current_user,
        db
    )

    return {
        "watched_count": watched_count,
        "favorites_count": favorites_count,
        "watchlist_count": watchlist_count,
        "reviews_count": reviews_count,
        "collections_count": collections_count,
        "total_searches": total_searches,
        "most_watched_genre": (
            top_genres[0]["genre"]
            if top_genres
            else None
        ),
        "watched_this_month": watched_this_month,
        "streak_count": watched_streak(watched_movies),
    }


@router.get("/dashboard/genres")
def get_top_genres(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    watched_movies = (
        db.query(WatchedMovie)
        .filter(
            WatchedMovie.user_id == current_user.id
        )
        .all()
    )

    counter = Counter()

    for movie in watched_movies:
        for genre in (movie.genre or "").split(","):
            clean_genre = genre.strip()
            if clean_genre:
                counter[clean_genre] += 1

    return [
        {
            "genre": genre,
            "count": count,
        }
        for genre, count in counter.most_common(5)
    ]


@router.get("/dashboard/monthly")
def get_monthly_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    months = last_six_months()
    month_counts = {
        month_key(month): 0
        for month in months
    }

    watched_movies = (
        db.query(WatchedMovie)
        .filter(
            WatchedMovie.user_id == current_user.id
        )
        .all()
    )

    for movie in watched_movies:
        if not movie.watched_at:
            continue

        key = month_key(movie.watched_at)

        if key in month_counts:
            month_counts[key] += 1

    return [
        {
            "month": month_label(month),
            "count": month_counts[month_key(month)],
        }
        for month in months
    ]


@router.get("/dashboard/recent")
def get_recent_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    recent_watched = (
        db.query(WatchedMovie)
        .filter(
            WatchedMovie.user_id == current_user.id
        )
        .order_by(
            WatchedMovie.watched_at.desc()
        )
        .limit(5)
        .all()
    )

    recent_favorites = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id
        )
        .order_by(
            Favorite.id.desc()
        )
        .limit(5)
        .all()
    )

    recent_reviews = (
        db.query(Review)
        .filter(
            Review.user_id == current_user.id
        )
        .order_by(
            Review.id.desc()
        )
        .limit(5)
        .all()
    )

    return {
        "recent_watched": [
            {
                "title": movie.title,
                "poster": movie.poster,
                "watched_date": movie.watched_at,
            }
            for movie in recent_watched
        ],
        "recent_favorites": [
            {
                "title": movie.title,
                "poster": movie.poster,
            }
            for movie in recent_favorites
        ],
        "recent_reviews": [
            {
                "movie_title": review.movie_title or review.movie_id,
                "rating": review.rating,
                "created_at": review.created_at,
            }
            for review in recent_reviews
        ],
    }
