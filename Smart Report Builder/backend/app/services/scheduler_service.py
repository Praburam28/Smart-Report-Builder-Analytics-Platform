from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.report_schedule import ReportSchedule
from app.services.report_history_service import ReportHistoryService
from app.services.report_service import ReportService


scheduler = BackgroundScheduler()


def execute_scheduled_report(schedule_id: int):
    db: Session = SessionLocal()

    try:
        schedule = (
            db.query(ReportSchedule)
            .filter(
                ReportSchedule.id == schedule_id,
                ReportSchedule.is_active.is_(True),
            )
            .first()
        )

        if not schedule:
            return

        report = schedule.report

        if not report:
            return

        start_time = datetime.utcnow()

        try:
            result = ReportService.run_report(
                db=db,
                report=report,
            )

            execution_time = (
                datetime.utcnow() - start_time
            ).total_seconds()

            ReportHistoryService.create_history(
                db=db,
                report_id=report.id,
                executed_by=schedule.created_by,
                status="SUCCESS",
                execution_time=execution_time,
                record_count=result["total_records"],
            )

            schedule.last_run_at = datetime.utcnow()

            db.commit()

        except Exception as exc:

            execution_time = (
                datetime.utcnow() - start_time
            ).total_seconds()

            ReportHistoryService.create_history(
                db=db,
                report_id=report.id,
                executed_by=schedule.created_by,
                status="FAILED",
                execution_time=execution_time,
                record_count=0,
                error_message=str(exc),
            )

            schedule.last_run_at = datetime.utcnow()

            db.commit()

    finally:
        db.close()


def add_schedule(schedule: ReportSchedule):

    job_id = f"report_schedule_{schedule.id}"

    # Remove existing job if it already exists
    existing_job = scheduler.get_job(job_id)

    if existing_job:
        scheduler.remove_job(job_id)

    # Convert HH:MM into hour and minute
    hour, minute = map(
        int,
        schedule.scheduled_time.split(":"),
    )

    # ========================================================
    # DAILY
    # ========================================================

    if schedule.frequency == "DAILY":

        scheduler.add_job(
            execute_scheduled_report,
            trigger="cron",
            hour=hour,
            minute=minute,
            args=[schedule.id],
            id=job_id,
            replace_existing=True,
        )

    # ========================================================
    # WEEKLY
    # ========================================================

    elif schedule.frequency == "WEEKLY":

        weekday_map = {
            "MONDAY": 0,
            "TUESDAY": 1,
            "WEDNESDAY": 2,
            "THURSDAY": 3,
            "FRIDAY": 4,
            "SATURDAY": 5,
            "SUNDAY": 6,
        }

        if not schedule.day_of_week:

            raise ValueError(
                "day_of_week is required for weekly schedules."
            )

        day_name = schedule.day_of_week.upper()

        if day_name not in weekday_map:

            raise ValueError(
                f"Invalid weekday: {schedule.day_of_week}"
            )

        day = weekday_map[day_name]

        scheduler.add_job(
            execute_scheduled_report,
            trigger="cron",
            day_of_week=day,
            hour=hour,
            minute=minute,
            args=[schedule.id],
            id=job_id,
            replace_existing=True,
        )

    # ========================================================
    # MONTHLY
    # ========================================================

    elif schedule.frequency == "MONTHLY":

        if schedule.day_of_month is None:

            raise ValueError(
                "day_of_month is required for monthly schedules."
            )

        scheduler.add_job(
            execute_scheduled_report,
            trigger="cron",
            day=schedule.day_of_month,
            hour=hour,
            minute=minute,
            args=[schedule.id],
            id=job_id,
            replace_existing=True,
        )

    else:

        raise ValueError(
            f"Unsupported schedule frequency: "
            f"{schedule.frequency}"
        )


def remove_schedule(schedule_id: int):

    job_id = f"report_schedule_{schedule_id}"

    if scheduler.get_job(job_id):

        scheduler.remove_job(job_id)


def load_existing_schedules():

    db: Session = SessionLocal()

    try:

        schedules = (
            db.query(ReportSchedule)
            .filter(
                ReportSchedule.is_active.is_(True)
            )
            .all()
        )

        for schedule in schedules:

            try:

                add_schedule(schedule)

            except Exception as exc:

                print(
                    f"Could not load schedule "
                    f"{schedule.id}: {exc}"
                )

    finally:

        db.close()


def start_scheduler():

    if scheduler.running:
        return

    load_existing_schedules()

    scheduler.start()

    print(
        "Report scheduler started successfully."
    )


def shutdown_scheduler():

    if scheduler.running:

        scheduler.shutdown()

        print(
            "Report scheduler stopped."
        )