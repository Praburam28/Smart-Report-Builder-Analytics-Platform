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
from app.schemas.report_schedule import (
    ReportScheduleCreate,
    ReportScheduleResponse,
)
from app.services.report_schedule_service import (
    ReportScheduleService,
)
from app.services.scheduler_service import (
    add_schedule,
    remove_schedule,
)
from app.services.audit_log_service import AuditLogService

router = APIRouter(
    prefix="/api/report-schedules",
    tags=["Report Scheduling"],
)


@router.post(
    "",
    response_model=ReportScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_schedule(
    request: ReportScheduleCreate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        schedule = ReportScheduleService.create_schedule(
        db=db,
        user_id=current_user.id,
        request=request,
    )

        add_schedule(schedule)
        
        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="CREATE_SCHEDULE",
            resource_type="REPORT_SCHEDULE",
            resource_id=schedule.id,
            description=(
                f"Created {schedule.frequency} schedule "
                f"for report {schedule.report_id}."
            ),
        )

        return schedule

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "",
    response_model=list[ReportScheduleResponse],
)
def get_schedules(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    return ReportScheduleService.get_user_schedules(
        db=db,
        user_id=current_user.id,
    )


@router.delete(
    "/{schedule_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_schedule(
    schedule_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        ReportScheduleService.delete_schedule(
        db=db,
        schedule_id=schedule_id,
        user_id=current_user.id,
        )

        remove_schedule(schedule_id)
        
        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="DELETE_SCHEDULE",
            resource_type="REPORT_SCHEDULE",
            resource_id=schedule_id,
            description=f"Deleted report schedule {schedule_id}.",
        )
        
    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    return None