from sqlalchemy.orm import Session

from app.models.report_schedule import ReportSchedule


class ReportScheduleRepository:

    @staticmethod
    def create(
        db: Session,
        schedule: ReportSchedule,
    ) -> ReportSchedule:

        db.add(schedule)
        db.commit()
        db.refresh(schedule)

        return schedule

    @staticmethod
    def get_by_id(
        db: Session,
        schedule_id: int,
    ) -> ReportSchedule | None:

        return (
            db.query(ReportSchedule)
            .filter(
                ReportSchedule.id == schedule_id
            )
            .first()
        )

    @staticmethod
    def get_by_user(
        db: Session,
        user_id: int,
    ) -> list[ReportSchedule]:

        return (
            db.query(ReportSchedule)
            .filter(
                ReportSchedule.created_by == user_id
            )
            .order_by(
                ReportSchedule.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def get_active(
        db: Session,
    ) -> list[ReportSchedule]:

        return (
            db.query(ReportSchedule)
            .filter(
                ReportSchedule.is_active.is_(True)
            )
            .all()
        )

    @staticmethod
    def delete(
        db: Session,
        schedule: ReportSchedule,
    ) -> None:

        db.delete(schedule)
        db.commit()