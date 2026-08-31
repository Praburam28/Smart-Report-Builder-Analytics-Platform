from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class ShareReportRequest(BaseModel):
    user_id: int
    permission: Literal["VIEW", "EDIT"]


class UpdateSharePermissionRequest(BaseModel):
    permission: Literal["VIEW", "EDIT"]


class SharedReportResponse(BaseModel):
    id: int
    report_id: int
    shared_with_user_id: int
    permission: str
    shared_by: int
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }