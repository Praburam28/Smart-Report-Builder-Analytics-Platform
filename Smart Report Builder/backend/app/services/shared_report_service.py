from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.shared_report import SharedReport
from app.models.user import User
from app.repositories.shared_report_repository import (
    SharedReportRepository,
)


class SharedReportService:

    @staticmethod
    def share_report(
        db: Session,
        report_id: int,
        owner_id: int,
        user_id: int,
        permission: str,
    ) -> SharedReport:

        report = (
            db.query(Report)
            .filter(Report.id == report_id)
            .first()
        )

        if not report:
            raise ValueError(
                "Report not found."
            )

        if report.created_by != owner_id:
            raise ValueError(
                "Only the report owner can share this report."
            )

        if permission not in {"VIEW", "EDIT"}:
            raise ValueError(
                "Permission must be VIEW or EDIT."
            )

        if user_id == owner_id:
            raise ValueError(
                "A report cannot be shared with its owner."
            )

        user = (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if not user:
            raise ValueError(
                "User to share with not found."
            )

        if not user.is_active:
            raise ValueError(
                "Cannot share a report with an inactive user."
            )

        existing = (
            SharedReportRepository.get_by_report_and_user(
                db,
                report_id,
                user_id,
            )
        )

        if existing:
            raise ValueError(
                "Report is already shared with this user."
            )

        shared_report = SharedReport(
            report_id=report_id,
            shared_with_user_id=user_id,
            permission=permission,
            shared_by=owner_id,
        )

        return SharedReportRepository.create(
            db,
            shared_report,
        )

    @staticmethod
    def get_shared_reports(
        db: Session,
        user_id: int,
    ) -> list[SharedReport]:

        return (
            SharedReportRepository.get_shared_with_user(
                db,
                user_id,
            )
        )

    @staticmethod
    def update_permission(
        db: Session,
        report_id: int,
        owner_id: int,
        user_id: int,
        permission: str,
    ) -> SharedReport:

        report = (
            db.query(Report)
            .filter(Report.id == report_id)
            .first()
        )

        if not report:
            raise ValueError(
                "Report not found."
            )

        if report.created_by != owner_id:
            raise ValueError(
                "Only the report owner can update permissions."
            )

        if permission not in {"VIEW", "EDIT"}:
            raise ValueError(
                "Permission must be VIEW or EDIT."
            )

        shared_report = (
            SharedReportRepository.get_by_report_and_user(
                db,
                report_id,
                user_id,
            )
        )

        if not shared_report:
            raise ValueError(
                "Report is not shared with this user."
            )

        shared_report.permission = permission

        db.commit()
        db.refresh(shared_report)

        return shared_report

    @staticmethod
    def remove_share(
        db: Session,
        report_id: int,
        owner_id: int,
        user_id: int,
    ) -> None:

        report = (
            db.query(Report)
            .filter(Report.id == report_id)
            .first()
        )

        if not report:
            raise ValueError(
                "Report not found."
            )

        if report.created_by != owner_id:
            raise ValueError(
                "Only the report owner can remove sharing."
            )

        shared_report = (
            SharedReportRepository.get_by_report_and_user(
                db,
                report_id,
                user_id,
            )
        )

        if not shared_report:
            raise ValueError(
                "Report is not shared with this user."
            )

        SharedReportRepository.delete(
            db,
            shared_report,
        )

    @staticmethod
    def get_share_for_user(
        db: Session,
        report_id: int,
        user_id: int,
    ) -> SharedReport | None:

        return (
            SharedReportRepository.get_by_report_and_user(
                db,
                report_id,
                user_id,
            )
        )
        
    @staticmethod
    def get_user_permission(
        db: Session,
        report_id: int,
        user_id: int,
    ) -> str | None:

        shared_report = (
            SharedReportRepository.get_by_report_and_user(
                db,
                report_id,
                user_id,
            )
        )

        if not shared_report:
            return None

        return shared_report.permission


    @staticmethod
    def can_view_report(
        db: Session,
        report_id: int,
        user_id: int,
    ) -> bool:

        report = (
            db.query(Report)
            .filter(Report.id == report_id)
            .first()
        )

        if not report:
            return False

        if report.created_by == user_id:
            return True

        permission = (
            SharedReportService.get_user_permission(
                db,
                report_id,
                user_id,
            )
        )

        return permission in {"VIEW", "EDIT"}


    @staticmethod
    def can_edit_report(
        db: Session,
        report_id: int,
        user_id: int,
    ) -> bool:

        report = (
            db.query(Report)
            .filter(Report.id == report_id)
            .first()
        )

        if not report:
            return False

        if report.created_by == user_id:
            return True

        permission = (
            SharedReportService.get_user_permission(
                db,
                report_id,
                user_id,
            )
        )

        return permission == "EDIT"