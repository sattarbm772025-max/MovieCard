from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()

from app.models.user import User
from app.database.connection import SessionLocal

import os

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    db = SessionLocal()

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        user = (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if not user:

            raise HTTPException(
                status_code=401,
                detail="Invalid user"
            )

        return user

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    finally:

        db.close()