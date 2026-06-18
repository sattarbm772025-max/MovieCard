from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.connection import SessionLocal

from app.models.collection import Collection
from app.models.collection_movie import CollectionMovie

from app.schemas.collection_schema import (
    CollectionCreate,
    CollectionMovieCreate
)

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/collections")
def create_collection(
    collection: CollectionCreate,
    db: Session = Depends(get_db)
):

    new_collection = Collection(
        user_id=1,
        name=collection.name,
        description=collection.description
    )

    db.add(new_collection)

    db.commit()

    db.refresh(new_collection)

    return {
        "message":
        "Collection created successfully"
    }


@router.get("/collections")
def get_collections(
    db: Session = Depends(get_db)
):

    return (
        db.query(Collection)
        .filter(Collection.user_id == 1)
        .all()
    )


@router.put("/collections/{collection_id}")
def update_collection(
    collection_id: int,
    data: CollectionCreate,
    db: Session = Depends(get_db)
):

    collection = (
        db.query(Collection)
        .filter(Collection.id == collection_id)
        .first()
    )

    if not collection:

        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    collection.name = data.name

    collection.description = data.description

    db.commit()

    return {
        "message":
        "Collection updated"
    }


@router.delete("/collections/{collection_id}")
def delete_collection(
    collection_id: int,
    db: Session = Depends(get_db)
):

    collection = (
        db.query(Collection)
        .filter(Collection.id == collection_id)
        .first()
    )

    if not collection:

        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    db.delete(collection)

    db.commit()

    return {
        "message":
        "Collection deleted"
    }


@router.post("/collections/{collection_id}/movies")
def add_movie_to_collection(
    collection_id: int,
    movie: CollectionMovieCreate,
    db: Session = Depends(get_db)
):

    new_movie = CollectionMovie(
        collection_id=collection_id,
        movie_id=movie.movie_id,
        title=movie.title,
        poster=movie.poster,
        genre=movie.genre
    )

    db.add(new_movie)

    db.commit()

    return {
        "message":
        "Movie added to collection"
    }


@router.get("/collections/{collection_id}/movies")
def get_collection_movies(
    collection_id: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(CollectionMovie)
        .filter(
            CollectionMovie.collection_id
            == collection_id
        )
        .all()
    )


@router.delete(
    "/collections/{collection_id}/movies/{movie_id}"
)
def remove_movie(
    collection_id: int,
    movie_id: str,
    db: Session = Depends(get_db)
):

    movie = (
        db.query(CollectionMovie)
        .filter(
            CollectionMovie.collection_id
            == collection_id,
            CollectionMovie.movie_id
            == movie_id
        )
        .first()
    )

    if not movie:

        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    db.delete(movie)

    db.commit()

    return {
        "message":
        "Movie removed"
    }