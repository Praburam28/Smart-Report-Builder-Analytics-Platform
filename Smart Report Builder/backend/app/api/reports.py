import time

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.report import Report
from app.models.user import User
from app.schemas.report import (
    ReportCreate,
    ReportResponse,
    ReportRunResponse,
    ReportUpdate,
)
from app.schemas.report_history import ReportHistoryResponse
from app.services.audit_log_service import AuditLogService
from app.services.report_history_service import (
    ReportHistoryService,
)
from app.services.report_service import ReportService
from app.services.shared_report_service import (
    SharedReportService,
)


router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"],
)


# ============================================================
# CREATE REPORT
# ============================================================

@router.post(
    "",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_report(
    request: ReportCreate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        report = ReportService.create_report(
            db=db,
            user_id=current_user.id,
            name=request.name,
            description=request.description,
            data_source=request.data_source,
            configuration=request.configuration.model_dump(),
        )

        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="CREATE_REPORT",
            resource_type="REPORT",
            resource_id=report.id,
            description=f"Created report '{report.name}'",
        )

        return report

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# ============================================================
# GET MY REPORTS
# ============================================================

@router.get(
    "",
    response_model=list[ReportResponse],
)
def get_reports(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    return ReportService.get_user_reports(
        db=db,
        user_id=current_user.id,
    )


# ============================================================
# GET SINGLE REPORT
# Owner OR VIEW OR EDIT
# ============================================================

@router.get(
    "/{report_id}",
    response_model=ReportResponse,
)
def get_report(
    report_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    report = (
        db.query(Report)
        .filter(
            Report.id == report_id
        )
        .first()
    )

    if not report:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found.",
        )

    if not SharedReportService.can_view_report(
        db=db,
        report_id=report_id,
        user_id=current_user.id,
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You do not have permission "
                "to view this report."
            ),
        )

    return report


# ============================================================
# RUN REPORT
# Owner OR VIEW OR EDIT
# ============================================================

@router.post(
    "/{report_id}/run",
    response_model=ReportRunResponse,
)
def run_report(
    report_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    start_time = time.perf_counter()

    report = (
        db.query(Report)
        .filter(
            Report.id == report_id
        )
        .first()
    )

    if not report:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found.",
        )

    if not SharedReportService.can_view_report(
        db=db,
        report_id=report_id,
        user_id=current_user.id,
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You do not have permission "
                "to run this report."
            ),
        )

    try:

        result = ReportService.run_report(
            db=db,
            report=report,
        )

        execution_time = (
            time.perf_counter() - start_time
        )

        ReportHistoryService.create_history(
            db=db,
            report_id=report.id,
            executed_by=current_user.id,
            status="SUCCESS",
            execution_time=execution_time,
            record_count=result["total_records"],
        )

        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="RUN_REPORT",
            resource_type="REPORT",
            resource_id=report.id,
            description=f"Executed report '{report.name}'",
        )

        return result

    except Exception as exc:

        execution_time = (
            time.perf_counter() - start_time
        )

        ReportHistoryService.create_history(
            db=db,
            report_id=report.id,
            executed_by=current_user.id,
            status="FAILED",
            execution_time=execution_time,
            record_count=0,
            error_message=str(exc),
        )

        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="RUN_REPORT_FAILED",
            resource_type="REPORT",
            resource_id=report.id,
            description=(
                f"Failed to execute report "
                f"'{report.name}': {str(exc)}"
            ),
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# ============================================================
# UPDATE REPORT
# Owner OR EDIT
# ============================================================

@router.put(
    "/{report_id}",
    response_model=ReportResponse,
)
def update_report(
    report_id: int,
    request: ReportUpdate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    report = (
        db.query(Report)
        .filter(
            Report.id == report_id
        )
        .first()
    )

    if not report:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found.",
        )

    if not SharedReportService.can_edit_report(
        db=db,
        report_id=report_id,
        user_id=current_user.id,
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You do not have EDIT permission "
                "for this report."
            ),
        )

    try:

        if request.name is not None:
            report.name = request.name

        if request.description is not None:
            report.description = request.description

        if request.configuration is not None:

            ReportService.validate_configuration(
                request.configuration
            )

            report.configuration = request.configuration

            ReportService.replace_filters(
                db=db,
                report=report,
                filters=request.configuration.get(
                    "filters",
                    [],
                ),
            )

        db.commit()
        db.refresh(report)

        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="UPDATE_REPORT",
            resource_type="REPORT",
            resource_id=report.id,
            description=f"Updated report '{report.name}'",
        )

        return report

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# ============================================================
# DELETE REPORT
# OWNER ONLY
# ============================================================

@router.delete(
    "/{report_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_report(
    report_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    report = (
        db.query(Report)
        .filter(
            Report.id == report_id
        )
        .first()
    )

    if not report:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found.",
        )

    if report.created_by != current_user.id:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only the report owner can "
                "delete this report."
            ),
        )

    report_name = report.name

    AuditLogService.create_log(
        db=db,
        user_id=current_user.id,
        action="DELETE_REPORT",
        resource_type="REPORT",
        resource_id=report_id,
        description=f"Deleted report '{report_name}'",
    )

    db.delete(report)
    db.commit()

    return None


# ============================================================
# GET REPORT HISTORY
# Owner OR VIEW OR EDIT
# ============================================================

@router.get(
    "/{report_id}/history",
    response_model=list[ReportHistoryResponse],
)
def get_report_history(
    report_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    report = (
        db.query(Report)
        .filter(
            Report.id == report_id
        )
        .first()
    )

    if not report:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found.",
        )

    if not SharedReportService.can_view_report(
        db=db,
        report_id=report_id,
        user_id=current_user.id,
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You do not have permission "
                "to view this report history."
            ),
        )

    return ReportHistoryService.get_report_history(
        db=db,
        report_id=report_id,
    )