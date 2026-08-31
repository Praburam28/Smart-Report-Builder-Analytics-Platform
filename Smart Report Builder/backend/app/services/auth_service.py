from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.role import Role
from app.models.user import User


class AuthService:

    @staticmethod
    def register_user(
        db: Session,
        name: str,
        email: str,
        password: str,
    ) -> User:

        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            raise ValueError("Email already registered")

        user_role = (
            db.query(Role)
            .filter(Role.name == "USER")
            .first()
        )

        if not user_role:
            raise ValueError("Default USER role not found")

        user = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            role_id=user_role.id,
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def authenticate_user(
        db: Session,
        email: str,
        password: str,
    ) -> User | None:

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            return None

        if not user.is_active:
            return None

        if not verify_password(
            password,
            user.password_hash,
        ):
            return None

        return user

    @staticmethod
    def generate_token(user: User) -> str:
        return create_access_token(
            {
                "sub": str(user.id),
                "role": user.role.name,
            }
        )