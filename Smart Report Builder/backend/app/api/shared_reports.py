from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.shared_report import (
    ShareReportRequest,
    SharedReportResponse,
    UpdateSharePermissionRequest,
)
from app.services.shared_report_service import (
    SharedReportService,
)
from app.services.audit_log_service import AuditLogService

router = APIRouter(
    prefix="/api",
    tags=["Shared Reports"],
)


@router.post(
    "/reports/{report_id}/share",
    response_model=SharedReportResponse,
    status_code=status.HTTP_201_CREATED,
)
def share_report(
    report_id: int,
    request: ShareReportRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        shared_report = SharedReportService.share_report(
            db=db,
            report_id=report_id,
            owner_id=current_user.id,
            user_id=request.user_id,
            permission=request.permission,
        )

        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="SHARE_REPORT",
            resource_type="REPORT",
            resource_id=report_id,
            description=(
                f"Shared report {report_id} with user "
                f"{request.user_id} with {request.permission} permission."
            ),
        )

        return shared_report

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "/reports/shared-with-me",
    response_model=list[SharedReportResponse],
)
def get_shared_reports(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    return SharedReportService.get_shared_reports(
        db=db,
        user_id=current_user.id,
    )


@router.put(
    "/reports/{report_id}/share/{user_id}",
    response_model=SharedReportResponse,
)
def update_share_permission(
    report_id: int,
    user_id: int,
    request: UpdateSharePermissionRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        shared_report = SharedReportService.update_permission(
            db=db,
            report_id=report_id,
            owner_id=current_user.id,
            user_id=user_id,
            permission=request.permission,
        )

        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="UPDATE_REPORT_PERMISSION",
            resource_type="REPORT",
            resource_id=report_id,
            description=(
                f"Updated report {report_id} permission for "
                f"user {user_id} to {request.permission}."
            ),
        )

        return shared_report

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.delete(
    "/reports/{report_id}/share/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_share(
    report_id: int,
    user_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        SharedReportService.remove_share(
            db=db,
            report_id=report_id,
            owner_id=current_user.id,
            user_id=user_id,
        )
        
        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="REMOVE_REPORT_SHARE",
            resource_type="REPORT",
            resource_id=report_id,
            description=(
                f"Removed report {report_id} sharing "
                f"for user {user_id}."
            ),
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )