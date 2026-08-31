from sqlalchemy.orm import Session

from app.models.report_template import ReportTemplate


class ReportTemplateRepository:

    @staticmethod
    def create(
        db: Session,
        template: ReportTemplate,
    ) -> ReportTemplate:

        db.add(template)
        db.commit()
        db.refresh(template)

        return template

    @staticmethod
    def get_by_id(
        db: Session,
        template_id: int,
    ) -> ReportTemplate | None:

        return (
            db.query(ReportTemplate)
            .filter(
                ReportTemplate.id == template_id
            )
            .first()
        )

    @staticmethod
    def get_by_user(
        db: Session,
        user_id: int,
    ) -> list[ReportTemplate]:

        return (
            db.query(ReportTemplate)
            .filter(
                ReportTemplate.created_by == user_id
            )
            .order_by(
                ReportTemplate.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def delete(
        db: Session,
        template: ReportTemplate,
    ) -> None:

        db.delete(template)
        db.commit()