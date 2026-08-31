from sqlalchemy.orm import Session

from app.models.report_history import ReportHistory
from app.repositories.report_history_repository import (
    ReportHistoryRepository,
)


class ReportHistoryService:

    @staticmethod
    def create_history(
        db: Session,
        report_id: int,
        executed_by: int,
        status: str,
        execution_time: float | None,
        record_count: int,
        error_message: str | None = None,
    ) -> ReportHistory:

        history = ReportHistory(
            report_id=report_id,
            executed_by=executed_by,
            status=status,
            execution_time=execution_time,
            record_count=record_count,
            error_message=error_message,
        )

        return ReportHistoryRepository.create(
            db,
            history,
        )

    @staticmethod
    def get_report_history(
        db: Session,
        report_id: int,
    ) -> list[ReportHistory]:

        return ReportHistoryRepository.get_by_report(
            db,
            report_id,
        )

    @staticmethod
    def get_user_history(
        db: Session,
        user_id: int,
    ) -> list[ReportHistory]:

        return ReportHistoryRepository.get_by_user(
            db,
            user_id,
        )