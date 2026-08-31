from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ReportScheduleCreate(BaseModel):

    report_id: int

    frequency: Literal[
        "DAILY",
        "WEEKLY",
        "MONTHLY",
    ]

    scheduled_time: str = Field(
        pattern=r"^(?:[01]\d|2[0-3]):[0-5]\d$"
    )

    day_of_week: str | None = None

    day_of_month: int | None = Field(
        default=None,
        ge=1,
        le=31,
    )


class ReportScheduleResponse(BaseModel):

    id: int
    report_id: int
    created_by: int
    frequency: str
    scheduled_time: str
    day_of_week: str | None
    day_of_month: int | None
    is_active: bool
    last_run_at: datetime | None
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }