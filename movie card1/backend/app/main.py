from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import (
    Base,
    engine
)

from app.routes import (
    auth,
    movies,
    favorites
)

# Create Database Tables
Base.metadata.create_all(bind=engine)

# FastAPI App
app = FastAPI(
    title="Movie Recommendation API"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(favorites.router)

# Home Route
@app.get("/")
def home():

    return {
        "message": "Movie API Running"
    }