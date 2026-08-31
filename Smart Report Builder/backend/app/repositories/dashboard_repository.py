from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.report_history import ReportHistory


class DashboardRepository:

    @staticmethod
    def get_total_reports(
        db: Session,
        user_id: int,
    ) -> int:

        return (
            db.query(func.count(Report.id))
            .filter(
                Report.created_by == user_id
            )
            .scalar()
            or 0
        )

    @staticmethod
    def get_total_executions(
        db: Session,
        user_id: int,
    ) -> int:

        return (
            db.query(func.count(ReportHistory.id))
            .join(
                Report,
                Report.id == ReportHistory.report_id,
            )
            .filter(
                Report.created_by == user_id
            )
            .scalar()
            or 0
        )

    @staticmethod
    def get_successful_executions(
        db: Session,
        user_id: int,
    ) -> int:

        return (
            db.query(func.count(ReportHistory.id))
            .join(
                Report,
                Report.id == ReportHistory.report_id,
            )
            .filter(
                Report.created_by == user_id,
                ReportHistory.status == "SUCCESS",
            )
            .scalar()
            or 0
        )

    @staticmethod
    def get_failed_executions(
        db: Session,
        user_id: int,
    ) -> int:

        return (
            db.query(func.count(ReportHistory.id))
            .join(
                Report,
                Report.id == ReportHistory.report_id,
            )
            .filter(
                Report.created_by == user_id,
                ReportHistory.status == "FAILED",
            )
            .scalar()
            or 0
        )

    @staticmethod
    def get_recent_reports(
        db: Session,
        user_id: int,
        limit: int = 5,
    ) -> list[Report]:

        return (
            db.query(Report)
            .filter(
                Report.created_by == user_id
            )
            .order_by(
                Report.created_at.desc()
            )
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_frequently_used_reports(
        db: Session,
        user_id: int,
        limit: int = 5,
    ):

        return (
            db.query(
                Report.id.label("report_id"),
                Report.name.label("report_name"),
                func.count(
                    ReportHistory.id
                ).label("execution_count"),
            )
            .join(
                ReportHistory,
                Report.id == ReportHistory.report_id,
            )
            .filter(
                Report.created_by == user_id
            )
            .group_by(
                Report.id,
                Report.name,
            )
            .order_by(
                func.count(
                    ReportHistory.id
                ).desc()
            )
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_execution_statistics(
        db: Session,
        user_id: int,
    ):

        return (
            db.query(
                func.date(
                    ReportHistory.created_at
                ).label("date"),

                func.sum(
                    func.if_(
                        ReportHistory.status == "SUCCESS",
                        1,
                        0,
                    )
                ).label("successful"),

                func.sum(
                    func.if_(
                        ReportHistory.status == "FAILED",
                        1,
                        0,
                    )
                ).label("failed"),
            )
            .join(
                Report,
                Report.id == ReportHistory.report_id,
            )
            .filter(
                Report.created_by == user_id
            )
            .group_by(
                func.date(
                    ReportHistory.created_at
                )
            )
            .order_by(
                func.date(
                    ReportHistory.created_at
                )
            )
            .all()
        )