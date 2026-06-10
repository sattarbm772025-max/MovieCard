from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

from app.routes import (
    auth,
    movies,
    favorites,
    reviews,
    history,
    dashboard,
    recommendations,
    watchlist
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Movie Recommendation API"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

app.include_router(
    recommendations.router
)

app.include_router(
    watchlist.router
)

@app.get("/")
def home():

    return {
        "message":
        "Movie Recommendation API Running"
    }