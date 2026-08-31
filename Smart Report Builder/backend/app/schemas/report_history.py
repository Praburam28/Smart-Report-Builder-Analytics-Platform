from datetime import datetime

from pydantic import BaseModel


class ReportHistoryResponse(BaseModel):
    id: int
    report_id: int
    executed_by: int
    status: str
    execution_time: float | None
    record_count: int
    error_message: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }