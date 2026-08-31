from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


class AuditLogRepository:

    @staticmethod
    def create(
        db: Session,
        audit_log: AuditLog,
    ) -> AuditLog:

        db.add(audit_log)
        db.commit()
        db.refresh(audit_log)

        return audit_log

    @staticmethod
    def get_all(
        db: Session,
        limit: int = 100,
    ) -> list[AuditLog]:

        return (
            db.query(AuditLog)
            .order_by(
                AuditLog.created_at.desc()
            )
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_user(
        db: Session,
        user_id: int,
        limit: int = 100,
    ) -> list[AuditLog]:

        return (
            db.query(AuditLog)
            .filter(
                AuditLog.user_id == user_id
            )
            .order_by(
                AuditLog.created_at.desc()
            )
            .limit(limit)
            .all()
        )