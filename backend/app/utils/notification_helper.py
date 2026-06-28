from app.models.notification import Notification


def create_notification(
    db,
    user_id,
    message,
    notification_type
):

    if not user_id:
        return None

    notification = Notification(
        user_id=user_id,
        message=message,
        type=notification_type
    )

    db.add(notification)

    return notification
