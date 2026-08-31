from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.report_schedule import ReportSchedule
from app.repositories.report_schedule_repository import (
    ReportScheduleRepository,
)


class ReportScheduleService:

    @staticmethod
    def create_schedule(
        db: Session,
        user_id: int,
        request,
    ) -> ReportSchedule:

        report = (
            db.query(Report)
            .filter(
                Report.id == request.report_id
            )
            .first()
        )

        if not report:
            raise ValueError(
                "Report not found."
            )

        if report.created_by != user_id:
            raise ValueError(
                "Only the report owner can schedule reports."
            )

        if request.frequency == "WEEKLY":

            if not request.day_of_week:

                raise ValueError(
                    "day_of_week is required for weekly schedules."
                )

        if request.frequency == "MONTHLY":

            if request.day_of_month is None:

                raise ValueError(
                    "day_of_month is required for monthly schedules."
                )

        schedule = ReportSchedule(
            report_id=request.report_id,
            created_by=user_id,
            frequency=request.frequency,
            scheduled_time=request.scheduled_time,
            day_of_week=request.day_of_week,
            day_of_month=request.day_of_month,
            is_active=True,
        )

        return ReportScheduleRepository.create(
            db,
            schedule,
        )

    @staticmethod
    def get_user_schedules(
        db: Session,
        user_id: int,
    ):

        return ReportScheduleRepository.get_by_user(
            db,
            user_id,
        )

    @staticmethod
    def delete_schedule(
        db: Session,
        schedule_id: int,
        user_id: int,
    ):

        schedule = (
            ReportScheduleRepository.get_by_id(
                db,
                schedule_id,
            )
        )

        if not schedule:

            raise ValueError(
                "Schedule not found."
            )

        if schedule.created_by != user_id:

            raise ValueError(
                "You do not have permission to delete this schedule."
            )

        ReportScheduleRepository.delete(
            db,
            schedule,
        )