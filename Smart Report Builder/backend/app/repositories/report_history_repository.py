from sqlalchemy.orm import Session

from app.models.report_history import ReportHistory


class ReportHistoryRepository:

    @staticmethod
    def create(
        db: Session,
        history: ReportHistory,
    ) -> ReportHistory:

        db.add(history)
        db.commit()
        db.refresh(history)

        return history

    @staticmethod
    def get_by_report(
        db: Session,
        report_id: int,
    ) -> list[ReportHistory]:

        return (
            db.query(ReportHistory)
            .filter(
                ReportHistory.report_id == report_id
            )
            .order_by(
                ReportHistory.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def get_by_user(
        db: Session,
        user_id: int,
    ) -> list[ReportHistory]:

        return (
            db.query(ReportHistory)
            .filter(
                ReportHistory.executed_by == user_id
            )
            .order_by(
                ReportHistory.created_at.desc()
            )
            .all()
        )