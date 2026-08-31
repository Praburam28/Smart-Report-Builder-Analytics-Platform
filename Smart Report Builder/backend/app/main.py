from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from app.api.admin import router as admin_router
from app.api.auth import router as auth_router
from app.api.reports import router as reports_router
from app.api.users import router as users_router
from app.core.database import SessionLocal, get_db
from app.utils.seed import seed_admin, seed_roles
from app.api.report_templates import (
    router as report_templates_router,
)
from app.api.shared_reports import router as shared_reports_router
from app.api.dashboard import router as dashboard_router
from app.api.exports import router as exports_router
from app.api.report_schedules import (
    router as report_schedules_router,
)
from app.services.scheduler_service import (
    start_scheduler,
    shutdown_scheduler,
)
from app.api.audit_logs import (
    router as audit_logs_router,
)



app = FastAPI(
    title="Smart Report Builder & Analytics Platform",
    description=(
        "Full-stack platform for creating, managing, "
        "analyzing, scheduling, and exporting custom reports."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(auth_router)
app.include_router(users_router)
app.include_router(admin_router)
app.include_router(report_templates_router)
app.include_router(shared_reports_router)
app.include_router(reports_router)
app.include_router(dashboard_router)
app.include_router(exports_router)
app.include_router(report_schedules_router)
app.include_router(audit_logs_router)


@app.on_event("startup")
def startup_event():

    db = SessionLocal()

    try:
        seed_roles(db)
        seed_admin(db)
    finally:
        db.close()

    start_scheduler()

@app.on_event("shutdown")
def shutdown_event():

    shutdown_scheduler()

@app.get("/")
def root():
    return {
        "message": "Smart Report Builder API is running",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }


@app.get("/health/database")
def database_health_check(
    db: Session = Depends(get_db),
):
    result = db.execute(text("SELECT 1"))
    value = result.scalar()

    return {
        "database": "connected",
        "test_result": value,
    }