from datetime import datetime

from pydantic import BaseModel


class AuditLogResponse(BaseModel):

    id: int
    user_id: int | None
    action: str
    resource_type: str | None
    resource_id: int | None
    description: str | None
    ip_address: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }