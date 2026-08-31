from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.repositories.audit_log_repository import (
    AuditLogRepository,
)


class AuditLogService:

    @staticmethod
    def create_log(
        db: Session,
        user_id: int | None,
        action: str,
        resource_type: str | None = None,
        resource_id: int | None = None,
        description: str | None = None,
        ip_address: str | None = None,
    ) -> AuditLog:

        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            description=description,
            ip_address=ip_address,
        )

        return AuditLogRepository.create(
            db=db,
            audit_log=audit_log,
        )

    @staticmethod
    def get_all_logs(
        db: Session,
        limit: int = 100,
    ):

        return AuditLogRepository.get_all(
            db=db,
            limit=limit,
        )

    @staticmethod
    def get_user_logs(
        db: Session,
        user_id: int,
        limit: int = 100,
    ):

        return AuditLogRepository.get_by_user(
            db=db,
            user_id=user_id,
            limit=limit,
        )