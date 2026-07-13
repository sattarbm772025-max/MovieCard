from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy import func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal

from app.models.collection import Collection
from app.models.collection_movie import CollectionMovie
from app.models.user import User
from app.utils.dependencies import get_current_user

from app.schemas.collection_schema import (
    CollectionCreate,
    CollectionMovieCreate,
    CollectionUpdate
)

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def normalize_visibility(value: str):

    visibility = (value or "private").lower()

    if visibility not in ["public", "private"]:

        raise HTTPException(
            status_code=400,
            detail="Visibility must be public or private"
        )

    return visibility


def collection_movie_count(
    db: Session,
    collection_id: int
):

    return (
        db.query(CollectionMovie)
        .filter(
            CollectionMovie.collection_id == collection_id
        )
        .count()
    )


def serialize_collection(
    collection: Collection,
    db: Session,
    owner_name: str | None = None
):

    return {
        "id": collection.id,
        "name": collection.name,
        "description": collection.description,
        "visibility": collection.visibility or "private",
        "cover_image": collection.cover_image,
        "created_at": collection.created_at,
        "user_id": collection.user_id,
        "owner_name": owner_name,
        "movie_count": collection_movie_count(
            db,
            collection.id
        ),
    }


def get_owned_collection(
    collection_id: int,
    current_user: User,
    db: Session
):

    collection = (
        db.query(Collection)
        .filter(
            Collection.id == collection_id,
            Collection.user_id == current_user.id
        )
        .first()
    )

    if not collection:

        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    return collection


@router.post("/collections")
def create_collection(
    collection: CollectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    name = collection.name.strip()

    if not name:

        raise HTTPException(
            status_code=400,
            detail="Collection name is required"
        )

    duplicate = (
        db.query(Collection)
        .filter(
            Collection.user_id == current_user.id,
            func.lower(Collection.name) == name.lower()
        )
        .first()
    )

    if duplicate:

        raise HTTPException(
            status_code=400,
            detail="Collection name already exists"
        )

    new_collection = Collection(
        user_id=current_user.id,
        name=name,
        description=collection.description,
        visibility=normalize_visibility(collection.visibility)
    )

    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)

    return serialize_collection(
        new_collection,
        db,
        current_user.username
    )


@router.get("/collections")
def get_collections(
    sort: str = "newest",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    query = (
        db.query(Collection)
        .filter(Collection.user_id == current_user.id)
    )

    if sort == "oldest":
        query = query.order_by(Collection.created_at.asc())
    else:
        query = query.order_by(Collection.created_at.desc())

    collections = query.all()

    return [
        serialize_collection(
            collection,
            db,
            current_user.username
        )
        for collection in collections
    ]


@router.get("/collections/public")
def get_public_collections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    rows = (
        db.query(Collection, User.username)
        .join(User, Collection.user_id == User.id)
        .filter(Collection.visibility == "public")
        .order_by(Collection.created_at.desc())
        .all()
    )

    return [
        serialize_collection(
            collection,
            db,
            username
        )
        for collection, username in rows
    ]


@router.get("/collections/search")
def search_collections(
    query: str = "",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    search = f"%{query.strip()}%"

    rows = (
        db.query(Collection, User.username)
        .join(User, Collection.user_id == User.id)
        .filter(
            Collection.visibility == "public",
            or_(
                Collection.name.ilike(search),
                User.username.ilike(search)
            )
        )
        .order_by(Collection.created_at.desc())
        .all()
    )

    return [
        serialize_collection(
            collection,
            db,
            username
        )
        for collection, username in rows
    ]


@router.get("/collections/discover")
def discover_collections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return get_public_collections(
        current_user,
        db
    )


@router.get("/collections/{collection_id}")
def get_collection_details(
    collection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    row = (
        db.query(Collection, User.username)
        .join(User, Collection.user_id == User.id)
        .filter(Collection.id == collection_id)
        .first()
    )

    if not row:

        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    collection, owner_name = row

    if (
        collection.user_id != current_user.id
        and collection.visibility != "public"
    ):

        raise HTTPException(
            status_code=403,
            detail="You cannot view this private collection"
        )

    movies = (
        db.query(CollectionMovie)
        .filter(
            CollectionMovie.collection_id == collection_id
        )
        .all()
    )

    return {
        **serialize_collection(
            collection,
            db,
            owner_name
        ),
        "movies": movies,
        "can_edit": collection.user_id == current_user.id,
    }


@router.put("/collections/{collection_id}")
def update_collection(
    collection_id: int,
    data: CollectionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    collection = get_owned_collection(
        collection_id,
        current_user,
        db
    )

    name = data.name.strip()

    if not name:

        raise HTTPException(
            status_code=400,
            detail="Collection name is required"
        )

    duplicate = (
        db.query(Collection)
        .filter(
            Collection.user_id == current_user.id,
            Collection.id != collection_id,
            func.lower(Collection.name) == name.lower()
        )
        .first()
    )

    if duplicate:

        raise HTTPException(
            status_code=400,
            detail="Collection name already exists"
        )

    collection.name = name
    collection.description = data.description
    collection.visibility = normalize_visibility(data.visibility)

    db.commit()
    db.refresh(collection)

    return serialize_collection(
        collection,
        db,
        current_user.username
    )


@router.delete("/collections/{collection_id}")
def delete_collection(
    collection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    collection = get_owned_collection(
        collection_id,
        current_user,
        db
    )

    (
        db.query(CollectionMovie)
        .filter(CollectionMovie.collection_id == collection_id)
        .delete()
    )

    db.delete(collection)
    db.commit()

    return {
        "message": "Collection deleted"
    }


@router.post("/collections/{collection_id}/movies")
def add_movie_to_collection(
    collection_id: int,
    movie: CollectionMovieCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    collection = get_owned_collection(
        collection_id,
        current_user,
        db
    )

    duplicate = (
        db.query(CollectionMovie)
        .filter(
            CollectionMovie.collection_id == collection_id,
            CollectionMovie.movie_id == movie.movie_id
        )
        .first()
    )

    if duplicate:

        raise HTTPException(
            status_code=400,
            detail="Movie already exists in this collection"
        )

    new_movie = CollectionMovie(
        collection_id=collection_id,
        movie_id=movie.movie_id,
        title=movie.title,
        poster=movie.poster,
        genre=movie.genre,
        year=movie.year,
        imdb_rating=movie.imdb_rating,
        runtime=movie.runtime
    )

    if not collection.cover_image and movie.poster:
        collection.cover_image = movie.poster

    db.add(new_movie)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Movie already exists in this collection"
        )

    return {
        "message": "Movie added to collection"
    }


@router.get("/collections/{collection_id}/movies")
def get_collection_movies(
    collection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    details = get_collection_details(
        collection_id,
        current_user,
        db
    )

    return details["movies"]


@router.delete(
    "/collections/{collection_id}/movies/{movie_id}"
)
def remove_movie(
    collection_id: int,
    movie_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    collection = get_owned_collection(
        collection_id,
        current_user,
        db
    )

    movie = (
        db.query(CollectionMovie)
        .filter(
            CollectionMovie.collection_id == collection_id,
            CollectionMovie.movie_id == movie_id
        )
        .first()
    )

    if not movie:

        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    db.delete(movie)

    remaining_cover = (
        db.query(CollectionMovie)
        .filter(
            CollectionMovie.collection_id == collection_id,
            CollectionMovie.movie_id != movie_id
        )
        .first()
    )

    collection.cover_image = (
        remaining_cover.poster
        if remaining_cover
        else None
    )

    db.commit()

    return {
        "message": "Movie removed"
    }
