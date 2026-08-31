from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.role import Role
from app.models.user import User
from app.schemas.admin import (
    AdminUserResponse,
    AuditLogResponse,
    UserRoleUpdate,
    UserStatusUpdate,
)
from app.services.audit_log_service import AuditLogService


router = APIRouter(
    prefix="/api/admin",
    tags=["Administration"],
)


# ============================================================
# ADMIN DASHBOARD
# ============================================================

@router.get("/dashboard")
def admin_dashboard(
    current_user: User = Depends(require_admin),
):
    return {
        "message": "Welcome to the admin dashboard",
        "admin_id": current_user.id,
        "admin_name": current_user.name,
        "role": current_user.role.name,
    }


# ============================================================
# GET ALL USERS
# ============================================================

@router.get(
    "/users",
    response_model=list[AdminUserResponse],
)
def get_all_users(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):

    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.name,
            "is_active": user.is_active,
            "created_at": user.created_at,
        }
        for user in users
    ]


# ============================================================
# ACTIVATE / DEACTIVATE USER
# ============================================================

@router.put(
    "/users/{user_id}/status",
)
def update_user_status(
    user_id: int,
    request: UserStatusUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    if user.id == current_user.id and not request.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An administrator cannot deactivate their own account.",
        )

    user.is_active = request.is_active

    db.commit()
    db.refresh(user)

    AuditLogService.create_log(
        db=db,
        user_id=current_user.id,
        action=(
            "ACTIVATE_USER"
            if request.is_active
            else "DEACTIVATE_USER"
        ),
        resource_type="USER",
        resource_id=user.id,
        description=(
            f"User {user.email} was "
            f"{'activated' if request.is_active else 'deactivated'}."
        ),
    )

    return {
        "message": (
            "User activated successfully."
            if request.is_active
            else "User deactivated successfully."
        ),
        "user_id": user.id,
        "is_active": user.is_active,
    }


# ============================================================
# CHANGE USER ROLE
# ============================================================

@router.put(
    "/users/{user_id}/role",
)
def update_user_role(
    user_id: int,
    request: UserRoleUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    role = (
        db.query(Role)
        .filter(Role.id == request.role_id)
        .first()
    )

    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found.",
        )

    old_role = user.role.name

    user.role_id = role.id

    db.commit()
    db.refresh(user)

    AuditLogService.create_log(
        db=db,
        user_id=current_user.id,
        action="CHANGE_USER_ROLE",
        resource_type="USER",
        resource_id=user.id,
        description=(
            f"Changed user {user.email} role "
            f"from {old_role} to {role.name}."
        ),
    )

    return {
        "message": "User role updated successfully.",
        "user_id": user.id,
        "old_role": old_role,
        "new_role": role.name,
    }


# ============================================================
# GET ALL AUDIT LOGS
# ============================================================

@router.get(
    "/audit-logs",
    response_model=list[AuditLogResponse],
)
def get_audit_logs(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):

    return AuditLogService.get_all_logs(
        db=db,
        limit=100,
    )


# ============================================================
# GET USER AUDIT LOGS
# ============================================================

@router.get(
    "/audit-logs/user/{user_id}",
    response_model=list[AuditLogResponse],
)
def get_user_audit_logs(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return AuditLogService.get_user_logs(
        db=db,
        user_id=user_id,
        limit=100,
    )