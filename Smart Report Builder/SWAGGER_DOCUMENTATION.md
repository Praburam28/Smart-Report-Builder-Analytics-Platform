# Swagger / OpenAPI Documentation

The Smart Report Builder backend is implemented using FastAPI. FastAPI automatically generates an OpenAPI specification from the registered routes and Pydantic schemas.

## Swagger UI

```text
http://localhost:8000/docs
```

## ReDoc

```text
http://localhost:8000/redoc
```

## OpenAPI JSON

```text
http://localhost:8000/openapi.json
```

## Authentication

Protected endpoints use JWT Bearer authentication.

1. Call:

```text
POST /api/auth/login
```

2. Copy `access_token`.
3. Click **Authorize** in Swagger UI.
4. Enter:

```text
Bearer <access_token>
```

## Documented API Groups

- Authentication
- Users
- Administration
- Reports
- Report Templates
- Shared Reports
- Dashboard
- Report Scheduling
- Report Export
- Audit Logs

## Main Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Templates

```text
POST   /api/report-templates
GET    /api/report-templates
GET    /api/report-templates/{template_id}
PUT    /api/report-templates/{template_id}
DELETE /api/report-templates/{template_id}
POST   /api/report-templates/{template_id}/create-report
```

### Sharing

```text
POST   /api/reports/{report_id}/share
GET    /api/reports/shared-with-me
PUT    /api/reports/{report_id}/share/{user_id}
DELETE /api/reports/{report_id}/share/{user_id}
```

### Dashboard

```text
GET /api/dashboard
```

### Scheduling

```text
POST   /api/report-schedules
GET    /api/report-schedules
DELETE /api/report-schedules/{schedule_id}
```

### Export

```text
GET /api/reports/{report_id}/export/csv
GET /api/reports/{report_id}/export/excel
GET /api/reports/{report_id}/export/pdf
```

### Admin

```text
GET /api/admin/dashboard
GET /api/admin/users
```

### Health

```text
GET /
GET /health
GET /health/database
```

## Important

Swagger at `/docs` is the authoritative interactive API documentation because it is generated directly from the running FastAPI application. The exact report endpoints and schemas should always be verified there after deployment.
