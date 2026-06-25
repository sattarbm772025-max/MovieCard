from app.models.notification import Notification


def create_notification(
    db,
    user_id,
    message,
    notification_type
):

    notification = Notification(
        user_id=user_id,
        message=message,
        type=notification_type
    )

    db.add(notification)

    db.commit()