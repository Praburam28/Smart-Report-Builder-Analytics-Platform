from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.report_template import ReportTemplate
from app.repositories.report_repository import ReportRepository
from app.repositories.report_template_repository import (
    ReportTemplateRepository,
)
from app.services.report_service import ReportService
from app.models.report_filter import ReportFilter

class ReportTemplateService:

    @staticmethod
    def create_template(
        db: Session,
        user_id: int,
        name: str,
        description: str | None,
        data_source: str,
        configuration: dict,
    ) -> ReportTemplate:

        ReportService.validate_configuration(
            configuration
        )

        if data_source != "users":
            raise ValueError(
                "Unsupported data source. "
                "Currently only 'users' is supported."
            )

        template = ReportTemplate(
            name=name,
            description=description,
            data_source=data_source,
            configuration=configuration,
            created_by=user_id,
        )

        return ReportTemplateRepository.create(
            db,
            template,
        )
        
    @staticmethod
    def create_report_from_template(
        db: Session,
        template_id: int,
        user_id: int,
        name: str | None = None,
        description: str | None = None,
    ) -> Report:

        template = (
            ReportTemplateService.get_template(
                db=db,
                template_id=template_id,
                user_id=user_id,
            )
        )

        ReportService.validate_configuration(
            template.configuration
        )

        report = Report(
            name=name or template.name,
            description=(
                description
                if description is not None
                else template.description
            ),
            data_source=template.data_source,
            configuration=template.configuration,
            created_by=user_id,
        )

        db.add(report)
        db.flush()

        filters = template.configuration.get(
            "filters",
            [],
        )

        ReportService.save_filters(
            db=db,
            report=report,
            filters=filters,
        )

        db.commit()
        db.refresh(report)

        return report
    @staticmethod
    def get_templates(
        db: Session,
        user_id: int,
    ) -> list[ReportTemplate]:

        return ReportTemplateRepository.get_by_user(
            db,
            user_id,
        )

    @staticmethod
    def get_template(
        db: Session,
        template_id: int,
        user_id: int,
    ) -> ReportTemplate:

        template = (
            ReportTemplateRepository.get_by_id(
                db,
                template_id,
            )
        )

        if not template:
            raise ValueError(
                "Report template not found."
            )

        if template.created_by != user_id:
            raise ValueError(
                "You do not have access to this template."
            )

        return template

    @staticmethod
    def update_template(
        db: Session,
        template_id: int,
        user_id: int,
        name: str | None = None,
        description: str | None = None,
        configuration: dict | None = None,
    ) -> ReportTemplate:

        template = (
            ReportTemplateService.get_template(
                db=db,
                template_id=template_id,
                user_id=user_id,
            )
        )

        if name is not None:
            template.name = name

        if description is not None:
            template.description = description

        if configuration is not None:

            ReportService.validate_configuration(
                configuration
            )

            template.configuration = configuration

        db.commit()
        db.refresh(template)

        return template

    @staticmethod
    def delete_template(
        db: Session,
        template_id: int,
        user_id: int,
    ) -> None:

        template = (
            ReportTemplateService.get_template(
                db,
                template_id,
                user_id,
            )
        )

        ReportTemplateRepository.delete(
            db,
            template,
        )