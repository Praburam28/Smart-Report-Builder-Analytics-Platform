from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import (
    DashboardRepository,
)


class DashboardService:

    @staticmethod
    def get_dashboard(
        db: Session,
        user_id: int,
    ):

        total_reports = (
            DashboardRepository.get_total_reports(
                db,
                user_id,
            )
        )

        total_executions = (
            DashboardRepository.get_total_executions(
                db,
                user_id,
            )
        )

        successful_executions = (
            DashboardRepository.get_successful_executions(
                db,
                user_id,
            )
        )

        failed_executions = (
            DashboardRepository.get_failed_executions(
                db,
                user_id,
            )
        )

        recent_reports = (
            DashboardRepository.get_recent_reports(
                db,
                user_id,
            )
        )

        frequently_used = (
            DashboardRepository.get_frequently_used_reports(
                db,
                user_id,
            )
        )

        execution_statistics = (
            DashboardRepository.get_execution_statistics(
                db,
                user_id,
            )
        )

        return {
            "summary": {
                "total_reports": total_reports,
                "total_executions": total_executions,
                "successful_executions": successful_executions,
                "failed_executions": failed_executions,
            },

            "recent_reports": [
                {
                    "id": report.id,
                    "name": report.name,
                    "data_source": report.data_source,
                    "created_at": report.created_at,
                }
                for report in recent_reports
            ],

            "frequently_used_reports": [
                {
                    "report_id": row.report_id,
                    "report_name": row.report_name,
                    "execution_count": row.execution_count,
                }
                for row in frequently_used
            ],

            "execution_statistics": [
                {
                    "date": str(row.date),
                    "successful": row.successful or 0,
                    "failed": row.failed or 0,
                }
                for row in execution_statistics
            ],
        }