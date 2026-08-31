from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class SharedReport(Base):
    __tablename__ = "shared_reports"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id", ondelete="CASCADE"),
        nullable=False,
    )

    shared_with_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    permission: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    shared_by: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    report = relationship(
        "Report",
        backref="shared_reports",
    )

    shared_with = relationship(
        "User",
        foreign_keys=[shared_with_user_id],
        backref="received_shared_reports",
    )

    sharer = relationship(
        "User",
        foreign_keys=[shared_by],
    )

    __table_args__ = (
        UniqueConstraint(
            "report_id",
            "shared_with_user_id",
            name="uq_report_shared_user",
        ),
    )