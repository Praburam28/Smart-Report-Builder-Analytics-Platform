from datetime import datetime

from pydantic import BaseModel, Field


class UserStatusUpdate(BaseModel):
    is_active: bool


class UserRoleUpdate(BaseModel):
    role_id: int = Field(gt=0)


class AdminUserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime


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