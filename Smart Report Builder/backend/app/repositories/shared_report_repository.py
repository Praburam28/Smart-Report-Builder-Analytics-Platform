from sqlalchemy.orm import Session

from app.models.shared_report import SharedReport


class SharedReportRepository:

    @staticmethod
    def create(
        db: Session,
        shared_report: SharedReport,
    ) -> SharedReport:

        db.add(shared_report)
        db.commit()
        db.refresh(shared_report)

        return shared_report

    @staticmethod
    def get_by_id(
        db: Session,
        shared_report_id: int,
    ) -> SharedReport | None:

        return (
            db.query(SharedReport)
            .filter(
                SharedReport.id == shared_report_id
            )
            .first()
        )

    @staticmethod
    def get_by_report_and_user(
        db: Session,
        report_id: int,
        user_id: int,
    ) -> SharedReport | None:

        return (
            db.query(SharedReport)
            .filter(
                SharedReport.report_id == report_id,
                SharedReport.shared_with_user_id == user_id,
            )
            .first()
        )

    @staticmethod
    def get_shared_with_user(
        db: Session,
        user_id: int,
    ) -> list[SharedReport]:

        return (
            db.query(SharedReport)
            .filter(
                SharedReport.shared_with_user_id == user_id
            )
            .order_by(
                SharedReport.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def get_by_report(
        db: Session,
        report_id: int,
    ) -> list[SharedReport]:

        return (
            db.query(SharedReport)
            .filter(
                SharedReport.report_id == report_id
            )
            .all()
        )

    @staticmethod
    def delete(
        db: Session,
        shared_report: SharedReport,
    ) -> None:

        db.delete(shared_report)
        db.commit()