from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.responses import (
    Response,
    StreamingResponse,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.report import Report
from app.models.user import User
from app.services.export_service import ExportService
from app.services.shared_report_service import (
    SharedReportService,
)
from app.services.audit_log_service import AuditLogService



router = APIRouter(
    prefix="/api/reports",
    tags=["Report Export"],
)


def get_accessible_report(
    db: Session,
    report_id: int,
    user_id: int,
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
        user_id=user_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You do not have permission "
                "to export this report."
            ),
        )

    return report


# ============================================================
# CSV
# ============================================================

@router.get(
    "/{report_id}/export/csv"
)
def export_csv(
    report_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    report = get_accessible_report(
        db=db,
        report_id=report_id,
        user_id=current_user.id,
    )

    try:

        csv_data = ExportService.export_csv(
            db=db,
            report=report,
        )
        
        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="EXPORT_CSV",
            resource_type="REPORT",
            resource_id=report.id,
            description=f"Exported report '{report.name}' as CSV.",
        )

        filename = (
            f"{report.name}.csv"
        )

        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{filename}"'
                )
            },
        )

    except Exception as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# ============================================================
# EXCEL
# ============================================================

@router.get(
    "/{report_id}/export/excel"
)
def export_excel(
    report_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    report = get_accessible_report(
        db=db,
        report_id=report_id,
        user_id=current_user.id,
    )

    try:

        excel_data = ExportService.export_excel(
            db=db,
            report=report,
        )
        
        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="EXPORT_EXCEL",
            resource_type="REPORT",
            resource_id=report.id,
            description=f"Exported report '{report.name}' as Excel.",
        )

        filename = (
            f"{report.name}.xlsx"
        )

        return StreamingResponse(
            excel_data,
            media_type=(
                "application/vnd.openxmlformats-officedocument."
                "spreadsheetml.sheet"
            ),
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{filename}"'
                )
            },
        )

    except Exception as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# ============================================================
# PDF
# ============================================================

@router.get(
    "/{report_id}/export/pdf"
)
def export_pdf(
    report_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    report = get_accessible_report(
        db=db,
        report_id=report_id,
        user_id=current_user.id,
    )

    try:

        pdf_data = ExportService.export_pdf(
            db=db,
            report=report,
        )
        
        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="EXPORT_PDF",
            resource_type="REPORT",
            resource_id=report.id,
            description=f"Exported report '{report.name}' as PDF.",
        )

        filename = (
            f"{report.name}.pdf"
        )

        return StreamingResponse(
            pdf_data,
            media_type="application/pdf",
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{filename}"'
                )
            },
        )

    except Exception as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )