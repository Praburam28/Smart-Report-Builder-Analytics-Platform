from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.audit_log import AuditLogResponse
from app.services.audit_log_service import (
    AuditLogService,
)


router = APIRouter(
    prefix="/api/audit-logs",
    tags=["Audit Logs"],
)


@router.get(
    "",
    response_model=list[AuditLogResponse],
)
def get_audit_logs(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    if current_user.role.name != "ADMIN":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return AuditLogService.get_all_logs(
        db=db,
    )


@router.get(
    "/my-activity",
    response_model=list[AuditLogResponse],
)
def get_my_activity(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    return AuditLogService.get_user_logs(
        db=db,
        user_id=current_user.id,
    )