from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)


@router.get("")
def get_users(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    users = (
        db.query(User)
        .filter(
            User.is_active.is_(True),
            User.id != current_user.id,
        )
        .order_by(User.name.asc())
        .all()
    )

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.name,
            "is_active": user.is_active,
        }
        for user in users
    ]