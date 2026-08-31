# 📊 Smart Report Builder & Analytics Platform

<p align="center">
  <strong>A full-stack platform for creating, managing, analyzing, scheduling, sharing, and exporting custom reports.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge" alt="JWT">
</p>

---

## 🚀 Overview

**Smart Report Builder & Analytics Platform** is a full-stack reporting application designed to allow users to create and manage custom reports without repeatedly writing database queries.

The platform provides a centralized dashboard where users can:

* 📊 Create custom reports
* ⚙️ Configure report fields and filters
* ▶️ Execute reports
* 📜 View report execution history
* 📅 Schedule recurring reports
* 📤 Export reports
* 👥 Share reports with other users
* 🔐 Manage authentication and authorization
* 🧩 Create reusable report templates
* 📝 Track user activities through audit logs
* 👨‍💼 Manage users through an administrator module

The backend exposes REST APIs through FastAPI, while the frontend provides a modern React-based user interface.

---

# ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication

* User registration
* User login
* JWT authentication
* Current-user profile
* Protected routes
* Active/inactive account validation

</td>
<td width="50%">

### 📊 Report Management

* Create reports
* View reports
* Update reports
* Delete reports
* Execute reports
* Dynamic report configuration

</td>
</tr>

<tr>
<td>

### 📅 Report Scheduling

* Daily schedules
* Weekly schedules
* Monthly schedules
* Automatic report execution
* Execution history
* Scheduler job management

</td>
<td>

### 👥 Report Sharing

* Share reports
* View shared reports
* Update permissions
* Remove sharing
* Owner-based authorization

</td>
</tr>

<tr>
<td>

### 🧩 Report Templates

* Create templates
* View templates
* Update templates
* Delete templates
* Create reports from templates

</td>
<td>

### 📤 Export

* CSV export
* Excel export
* PDF export
* Downloadable report results

</td>
</tr>

<tr>
<td>

### 👨‍💼 Administration

* Admin dashboard
* View users
* Activate/deactivate users
* Change user roles
* Audit-log management

</td>
<td>

### 📈 Analytics

* Report statistics
* Execution statistics
* Recent reports
* Frequently used reports
* Success/failure tracking

</td>
</tr>
</table>

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────────┐
                    │       React UI          │
                    │   TypeScript + MUI      │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │       FastAPI           │
                    │       Backend           │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       ┌────────────┐     ┌────────────┐     ┌────────────┐
       │  Services  │     │Repositories│     │   JWT Auth │
       └─────┬──────┘     └─────┬──────┘     └────────────┘
             │                  │
             └──────────┬───────┘
                        ▼
                ┌───────────────┐
                │     MySQL     │
                │    Database   │
                └───────────────┘

                        +
                        
                ┌───────────────┐
                │   Scheduler   │
                │   APScheduler │
                └───────────────┘
```

---

# 🛠️ Technology Stack

## Backend

| Technology           | Purpose                    |
| -------------------- | -------------------------- |
| 🐍 Python            | Core programming language  |
| ⚡ FastAPI            | REST API framework         |
| 🗄️ SQLAlchemy       | ORM                        |
| 🐬 MySQL             | Relational database        |
| 🔑 JWT               | Authentication             |
| 🔒 Passlib / bcrypt  | Password hashing           |
| 🔄 Alembic           | Database migrations        |
| ⏰ APScheduler        | Scheduled report execution |
| 📚 Swagger / OpenAPI | API documentation          |

## Frontend

| Technology      | Purpose                 |
| --------------- | ----------------------- |
| ⚛️ React        | UI framework            |
| 📘 TypeScript   | Type-safe development   |
| 🎨 Material UI  | UI components           |
| 🌐 Axios        | API communication       |
| 🧭 React Router | Application routing     |
| 📊 Chart.js     | Analytics visualization |
| ⚡ Vite          | Frontend build tool     |

## Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman
* MySQL Workbench
* Swagger UI
* Docker

---

# 📁 Project Structure

```text
Smart-Report-Builder/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── admin.py
│   │   │   ├── reports.py
│   │   │   ├── report_templates.py
│   │   │   ├── shared_reports.py
│   │   │   ├── dashboard.py
│   │   │   ├── exports.py
│   │   │   ├── report_schedules.py
│   │   │   └── audit_logs.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── alembic/
│   ├── .env
│   ├── alembic.ini
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── App.tsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── postman/
│   └── Smart-Report-Builder.postman_collection.json
│
├── database/
│
└── README.md
```

---

# 🔐 Authentication Flow

The application uses **JWT-based authentication**.

```text
User
 │
 │ Email + Password
 ▼
Login API
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Frontend stores access token
 │
 ▼
Authorization: Bearer <token>
 │
 ▼
Protected API
 │
 ▼
Validate JWT
 │
 ▼
Get Current User
```

Protected endpoints require:

```http
Authorization: Bearer <access_token>
```

---

# 👤 Role-Based Access

The platform supports role-based authorization.

### User

Users can:

* Create reports
* Manage their reports
* Run reports
* Schedule reports
* Share reports
* Create templates
* Export reports
* View their activity

### Admin

Administrators additionally have access to:

* Admin dashboard
* User management
* User status management
* Role management
* Audit logs

---

# 📊 Report Configuration

Reports can be dynamically configured using:

```json
{
  "fields": [
    "id",
    "name",
    "email"
  ],
  "filters": [],
  "sort": [],
  "group_by": []
}
```

This allows the report engine to determine which fields should be returned and how the data should be filtered, sorted, or grouped.

---

# 📅 Report Scheduling

Reports can be scheduled using three frequencies:

```text
DAILY
WEEKLY
MONTHLY
```

Example:

```json
{
  "report_id": 1,
  "frequency": "WEEKLY",
  "scheduled_time": "09:00",
  "day_of_week": "MONDAY"
}
```

The scheduler executes the report automatically and stores execution information in report history.

---

# 👥 Report Sharing

Report owners can share reports with other users.

Example:

```json
{
  "user_id": 2,
  "permission": "VIEW"
}
```

Supported operations include:

```text
Share Report
     ↓
View Shared Reports
     ↓
Update Permission
     ↓
Remove Share
```

---

# 📝 Audit Logging

Important user actions are recorded through the audit-log module.

Examples include:

```text
CREATE_TEMPLATE
CREATE_REPORT_FROM_TEMPLATE
SHARE_REPORT
UPDATE_REPORT_PERMISSION
REMOVE_REPORT_SHARE
```

Audit logs help administrators track important system activities.

---

# 📤 Report Export

Reports can be exported using:

```text
GET /api/reports/{report_id}/export/csv
GET /api/reports/{report_id}/export/excel
GET /api/reports/{report_id}/export/pdf
```

---

# 📚 API Documentation

The backend automatically provides Swagger/OpenAPI documentation.

After starting the backend, open:

```text
http://127.0.0.1:8000/docs
```

Alternative OpenAPI specification:

```text
http://127.0.0.1:8000/openapi.json
```

The project API specification contains authentication, users, administration, reports, templates, sharing, dashboard, exports, scheduling, and audit-log endpoints.

---

# 📮 Postman

The project includes a Postman collection:

```text
postman/
└── Smart-Report-Builder.postman_collection.json
```

### Import

1. Open Postman
2. Select **Import**
3. Select the collection JSON file
4. Import the collection
5. Set the backend URL to:

```text
http://127.0.0.1:8000
```

### Recommended testing order

```text
1. Register
       ↓
2. Login
       ↓
3. Get Current User
       ↓
4. Create Report
       ↓
5. Get Reports
       ↓
6. Run Report
       ↓
7. View History
       ↓
8. Export Report
       ↓
9. Schedule Report
       ↓
10. Share Report
```

---

# ⚙️ Backend Setup

## 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd Smart-Report-Builder
```

## 2. Create virtual environment

```bash
cd backend

python -m venv .venv
```

### Windows

```powershell
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

---

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

# 🗄️ Database Configuration

The application uses MySQL.

Create the database:

```sql
CREATE DATABASE smart_report_db;
```

Your local development `.env` can use:

```env
DATABASE_URL=mysql+pymysql://root:1234@localhost:3306/smart_report_db

SECRET_KEY=change-this-development-secret

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> Do not commit your real `.env` file or production secrets to GitHub.

---

# 🔄 Run Database Migrations

From the `backend` directory:

```bash
alembic upgrade head
```

---

# ▶️ Start Backend

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🏗️ Production Build

Build the frontend:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🐳 Docker

The application can also be containerized for deployment.

Typical architecture:

```text
                Docker Compose
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ▼              ▼              ▼
   Frontend        Backend         MySQL
   React/Vite      FastAPI        Database
```

---

# 🧪 Testing

The APIs can be tested using:

### Swagger

```text
http://127.0.0.1:8000/docs
```

### Postman

Import:

```text
Smart-Report-Builder.postman_collection.json
```

### Frontend

```text
http://localhost:5173
```

---

# 🔎 Health Checks

Application health:

```http
GET /
```

API health:

```http
GET /health
```

Database health:

```http
GET /health/database
```

Example response:

```json
{
  "status": "healthy"
}
```

---

# 📌 Main API Modules

| Module               | Description                                |
| -------------------- | ------------------------------------------ |
| 🔐 Authentication    | Registration, login and JWT authentication |
| 👤 Users             | User-related operations                    |
| 👨‍💼 Administration | Admin and user management                  |
| 📊 Reports           | Report CRUD and execution                  |
| 🧩 Report Templates  | Reusable report templates                  |
| 👥 Shared Reports    | Report sharing and permissions             |
| 📈 Dashboard         | Analytics and report statistics            |
| 📤 Report Export     | CSV, Excel and PDF export                  |
| 📅 Report Scheduling | Daily, weekly and monthly scheduling       |
| 📝 Audit Logs        | Activity tracking                          |

---

# 🔒 Security

Security considerations implemented in the application include:

* JWT authentication
* Password hashing
* Protected API endpoints
* Role-based authorization
* Active-user validation
* Owner-based report authorization
* Protected admin endpoints
* Audit logging

For production deployment:

* Use a strong `SECRET_KEY`
* Store credentials in environment variables
* Do not commit `.env`
* Use HTTPS
* Use secure database credentials
* Configure production CORS settings

---

# 🎯 Future Enhancements

Possible future improvements:

* 📧 Email delivery for scheduled reports
* ☁️ Cloud deployment
* 📊 Advanced visualization builder
* 🔍 Advanced query/filter builder
* 📱 Responsive mobile UI
* 🔔 Notification system
* 📂 Report folders
* 📌 Favorite reports
* 📈 More advanced analytics
* 🧠 AI-assisted report generation

---

# 👨‍💻 Author

**Praburam R**

Python Developer | Backend Developer | Full-Stack Developer

### Technical Interests

```text
Python
FastAPI
React
TypeScript
MySQL
SQLAlchemy
REST APIs
JWT Authentication
Docker
Git & GitHub
```

---

# ⭐ Project Highlights

```text
✔ Full-Stack Application
✔ RESTful API Architecture
✔ JWT Authentication
✔ Role-Based Authorization
✔ Dynamic Report Builder
✔ Reusable Report Templates
✔ Report Sharing
✔ Report Scheduling
✔ Automated Execution
✔ Report History
✔ CSV / Excel / PDF Export
✔ Dashboard Analytics
✔ Audit Logging
✔ Swagger Documentation
✔ Postman API Collection
✔ Docker Ready
```

---

<p align="center">

### ⭐ If you find this project useful, consider giving it a star!

**Built with Python + FastAPI + React + MySQL ❤️**

</p>
