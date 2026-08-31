from typing import Any

from pydantic import BaseModel, Field


class FilterConfig(BaseModel):
    field: str
    operator: str
    value: Any


class SortConfig(BaseModel):
    field: str
    direction: str = "ASC"


class ReportConfiguration(BaseModel):
    fields: list[str] = Field(min_length=1)
    filters: list[FilterConfig] = Field(
        default_factory=list
    )

    sort: list[SortConfig] = Field(
        default_factory=list
    )

    group_by: list[str] = Field(
        default_factory=list
    )


class ReportCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=150,
    )

    description: str | None = None

    data_source: str = "users"

    configuration: ReportConfiguration


class ReportResponse(BaseModel):
    id: int
    name: str
    description: str | None
    data_source: str
    configuration: dict
    created_by: int

    model_config = {
        "from_attributes": True,
    }


class ReportRunResponse(BaseModel):
    report_id: int
    report_name: str
    data_source: str
    columns: list[str]
    rows: list[dict]
    total_records: int
    
class ReportUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    configuration: dict | None = None