from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.connection import SessionLocal
from app.models.favorite import Favorite
from app.schemas.favorite_schema import FavoriteCreate
from app.utils.dependencies import get_current_user
from app.models.user import User

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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    existing = (
        db.query(Favorite)
        .filter(
            Favorite.movie_id == favorite.movie_id,
            Favorite.user_id == current_user.id
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Already added"
        )

    new_favorite = Favorite(
        movie_id=favorite.movie_id,
        title=favorite.title,
        poster=favorite.poster,
        user_id=current_user.id
    )

    db.add(new_favorite)
    db.commit()

    return {
        "message": "Favorite added"
    }


@router.get("/favorites")
def get_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    favorites = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id
        )
        .all()
    )

    return favorites


@router.delete("/favorites/{movie_id}")
def delete_favorite(
    movie_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    filters = [
        Favorite.movie_id == movie_id
    ]

    if movie_id.isdigit():

        filters.append(
            Favorite.id == int(movie_id)
        )

    favorite = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            or_(*filters)
        )
        .first()
    )

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