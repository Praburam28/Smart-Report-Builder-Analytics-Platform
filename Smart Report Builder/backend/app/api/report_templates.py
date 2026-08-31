from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.report import ReportResponse
from app.schemas.report_template import (
    CreateReportFromTemplateRequest,
    ReportTemplateCreate,
    ReportTemplateResponse,
    ReportTemplateUpdate,
)
from app.services.report_template_service import (
    ReportTemplateService,
)
from app.services.audit_log_service import AuditLogService

router = APIRouter(
    prefix="/api/report-templates",
    tags=["Report Templates"],
)


@router.post(
    "",
    response_model=ReportTemplateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_template(
    request: ReportTemplateCreate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        template = (
            ReportTemplateService.create_template(
                db=db,
                user_id=current_user.id,
                name=request.name,
                description=request.description,
                data_source=request.data_source,
                configuration=request.configuration,
            )
        )
        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="CREATE_TEMPLATE",
            resource_type="REPORT_TEMPLATE",
            resource_id=template.id,
            description=f"Created report template '{template.name}'.",
        )

        return template


    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "",
    response_model=list[ReportTemplateResponse],
)
def get_templates(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    return ReportTemplateService.get_templates(
        db=db,
        user_id=current_user.id,
    )

@router.post(
    "/{template_id}/create-report",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_report_from_template(
    template_id: int,
    request: CreateReportFromTemplateRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        report = (
            ReportTemplateService.create_report_from_template(
                db=db,
                template_id=template_id,
                user_id=current_user.id,
                name=request.name,
                description=request.description,
            )
        )

        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="CREATE_REPORT_FROM_TEMPLATE",
            resource_type="REPORT",
            resource_id=report.id,
            description=(
                f"Created report '{report.name}' "
                f"from template {template_id}."
            ),
        )

        return report

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
        
@router.get(
    "/{template_id}",
    response_model=ReportTemplateResponse,
)
def get_template(
    template_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        return ReportTemplateService.get_template(
            db=db,
            template_id=template_id,
            user_id=current_user.id,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

@router.put(
    "/{template_id}",
    response_model=ReportTemplateResponse,
)
def update_template(
    template_id: int,
    request: ReportTemplateUpdate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        template = ReportTemplateService.update_template(
            db=db,
            template_id=template_id,
            user_id=current_user.id,
            name=request.name,
            description=request.description,
            configuration=request.configuration,
        )

        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="UPDATE_TEMPLATE",
            resource_type="REPORT_TEMPLATE",
            resource_id=template.id,
            description=f"Updated report template '{template.name}'.",
        )

        return template
        
        

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

@router.delete(
    "/{template_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_template(
    template_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        ReportTemplateService.delete_template(
            db=db,
            template_id=template_id,
            user_id=current_user.id,
        )

        AuditLogService.create_log(
            db=db,
            user_id=current_user.id,
            action="DELETE_TEMPLATE",
            resource_type="REPORT_TEMPLATE",
            resource_id=template_id,
            description=f"Deleted report template {template_id}.",
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )