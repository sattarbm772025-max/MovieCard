from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database.connection import (
    Base,
    engine
)

from app.models.user import User
from app.models.favorite import Favorite
from app.models.review import Review
from app.models.search_history import SearchHistory
from app.models.viewed_movie import ViewedMovie
from app.models.watchlist import Watchlist
from app.models.collection import Collection
from app.models.collection_movie import CollectionMovie
from app.models.notification import Notification
from app.models.review_like import ReviewLike
from app.models.collection_follow import CollectionFollow
from app.models.watched_movie import WatchedMovie
from app.models.user_preference import UserPreference

from app.routes import (
    auth,
    movies,
    favorites,
    reviews,
    history,
    dashboard,
    recommendations,
    watchlist,
    profile,
    admin,
    collections,
    notifications,
    review_likes,
    collection_follows,
    watched,
    preferences
    
)

Base.metadata.create_all(bind=engine)


def ensure_sqlite_columns():

    columns = {
        "collections": {
            "visibility": "VARCHAR DEFAULT 'private'",
            "cover_image": "VARCHAR",
        },
        "collection_movies": {
            "year": "VARCHAR",
            "imdb_rating": "VARCHAR",
            "runtime": "VARCHAR",
        },
    }

    with engine.begin() as connection:
        for table_name, table_columns in columns.items():
            existing_columns = {
                row[1]
                for row in connection.execute(
                    text(f"PRAGMA table_info({table_name})")
                )
            }

            for column_name, column_type in table_columns.items():
                if column_name not in existing_columns:
                    connection.execute(
                        text(
                            f"ALTER TABLE {table_name} "
                            f"ADD COLUMN {column_name} {column_type}"
                        )
                    )


ensure_sqlite_columns()

app = FastAPI(
    title="Movie Recommendation API"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://movie-card-steel.vercel.app",
    "https://movie-card-7ki2cetro-abdulstackly.vercel.app",
    "https://movie-card-1uy29ichm-abdulstackly.vercel.app",
    "https://movie-card-b6gbrnp02-abdulstackly.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://movie-card-[a-z0-9-]+\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(favorites.router)
app.include_router(reviews.router)
app.include_router(history.router)
app.include_router(dashboard.router)
app.include_router(recommendations.router)
app.include_router(watchlist.router)
app.include_router(profile.router)
app.include_router(admin.router)
app.include_router(collections.router)
app.include_router(notifications.router)
app.include_router(review_likes.router)
app.include_router(collection_follows.router)
app.include_router(watched.router)
app.include_router(preferences.router)


@app.get("/")
def home():

    return {
        "message": "Movie Recommendation API Running"
    }
