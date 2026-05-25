from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.favorite import Favorite
from app.schemas.favorite_schema import FavoriteCreate

router = APIRouter()

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

@router.post("/favorites")
def add_favorite(
    favorite: FavoriteCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(Favorite).filter(
        Favorite.movie_id == favorite.movie_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Already added"
        )

    new_favorite = Favorite(
        movie_id=favorite.movie_id,
        title=favorite.title,
        poster=favorite.poster,
        user_id=1
    )

    db.add(new_favorite)
    db.commit()

    return {
        "message": "Favorite added"
    }

@router.get("/favorites")
def get_favorites(
    db: Session = Depends(get_db)
):

    favorites = db.query(Favorite).all()

    return favorites

@router.delete("/favorites/{movie_id}")
def delete_favorite(
    movie_id: str,
    db: Session = Depends(get_db)
):

    favorite = db.query(Favorite).filter(
        Favorite.movie_id == movie_id
    ).first()

    if not favorite:
        raise HTTPException(
            status_code=404,
            detail="Favorite not found"
        )

    db.delete(favorite)
    db.commit()

    return {
        "message": "Favorite deleted"
    }