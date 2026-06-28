from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.connection import SessionLocal

from app.models.collection import Collection
from app.models.collection_follow import CollectionFollow
from app.models.user import User

from app.utils.dependencies import get_current_user
from app.utils.notification_helper import create_notification

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/collections/{collection_id}/follow")
def follow_collection(
    collection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    collection = (
        db.query(Collection)
        .filter(
            Collection.id == collection_id
        )
        .first()
    )

    if not collection:

        raise HTTPException(
            status_code=404,
            detail="Collection not found"
        )

    if collection.user_id == current_user.id:

        raise HTTPException(
            status_code=400,
            detail="You cannot follow your own collection"
        )

    existing_follow = (
        db.query(CollectionFollow)
        .filter(
            CollectionFollow.collection_id == collection_id,
            CollectionFollow.user_id == current_user.id
        )
        .first()
    )

    if existing_follow:

        raise HTTPException(
            status_code=400,
            detail="Already following"
        )

    follow = CollectionFollow(
        collection_id=collection_id,
        user_id=current_user.id
    )

    db.add(follow)

    create_notification(
        db,
        collection.user_id,
        f"{current_user.username} followed your collection",
        "collection_follow"
    )

    db.commit()

    return {
        "message": "Collection followed"
    }
