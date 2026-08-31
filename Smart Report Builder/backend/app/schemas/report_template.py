from typing import Any

from pydantic import BaseModel, Field


class ReportTemplateCreate(BaseModel):

    name: str = Field(
        min_length=2,
        max_length=150,
    )

    description: str | None = None

    data_source: str = "users"

    configuration: dict[str, Any]


class ReportTemplateUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    description: str | None = None

    configuration: dict[str, Any] | None = None


class ReportTemplateResponse(BaseModel):

    id: int
    name: str
    description: str | None
    data_source: str
    configuration: dict
    created_by: int

    model_config = {
        "from_attributes": True,
    }


class CreateReportFromTemplateRequest(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    description: str | None = None