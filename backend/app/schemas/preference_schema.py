from pydantic import BaseModel


class PreferenceCreate(BaseModel):

    genre: str
