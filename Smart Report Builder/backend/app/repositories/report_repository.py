from sqlalchemy.orm import Session

from app.models.report import Report


class ReportRepository:

    @staticmethod
    def create(
        db: Session,
        report: Report,
    ) -> Report:

        db.add(report)
        db.commit()
        db.refresh(report)

        return report

    @staticmethod
    def get_by_id(
        db: Session,
        report_id: int,
    ) -> Report | None:

        return (
            db.query(Report)
            .filter(Report.id == report_id)
            .first()
        )

    @staticmethod
    def get_by_user(
        db: Session,
        user_id: int,
    ) -> list[Report]:

        return (
            db.query(Report)
            .filter(Report.created_by == user_id)
            .order_by(Report.created_at.desc())
            .all()
        )

    @staticmethod
    def delete(
        db: Session,
        report: Report,
    ) -> None:

        db.delete(report)
        db.commit()