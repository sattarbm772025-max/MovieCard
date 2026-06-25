from pydantic import BaseModel


class NotificationResponse(BaseModel):

    id: int
    message: str
    type: str
    is_read: bool

    class Config:
        from_attributes = True