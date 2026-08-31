from app.core.security import hash_password
from app.models.role import Role
from app.models.user import User


def seed_roles(db):
    roles = [
        {
            "name": "ADMIN",
            "description": "System administrator",
        },
        {
            "name": "USER",
            "description": "Normal application user",
        },
    ]

    for role_data in roles:
        existing_role = (
            db.query(Role)
            .filter(Role.name == role_data["name"])
            .first()
        )

        if not existing_role:
            db.add(Role(**role_data))

    db.commit()


def seed_admin(db):
    admin_email = "admin@smartreport.com"

    existing_admin = (
        db.query(User)
        .filter(User.email == admin_email)
        .first()
    )

    if existing_admin:
        return

    admin_role = (
        db.query(Role)
        .filter(Role.name == "ADMIN")
        .first()
    )

    if not admin_role:
        raise ValueError("ADMIN role not found")

    admin = User(
        name="System Admin",
        email=admin_email,
        password_hash=hash_password("Admin@12345"),
        role_id=admin_role.id,
        is_active=True,
    )

    db.add(admin)
    db.commit()