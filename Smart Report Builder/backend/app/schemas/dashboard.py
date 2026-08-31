from datetime import datetime

from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_reports: int
    total_executions: int
    successful_executions: int
    failed_executions: int


class RecentReport(BaseModel):
    id: int
    name: str
    data_source: str
    created_at: datetime


class FrequentlyUsedReport(BaseModel):
    report_id: int
    report_name: str
    execution_count: int


class ExecutionStatistics(BaseModel):
    date: str
    successful: int
    failed: int


class DashboardResponse(BaseModel):
    summary: DashboardSummary
    recent_reports: list[RecentReport]
    frequently_used_reports: list[FrequentlyUsedReport]
    execution_statistics: list[ExecutionStatistics]