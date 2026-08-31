import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import CreateReport from "./pages/reports/CreateReport";
import ReportDetails from "./pages/reports/ReportDetails";
import Templates from "./pages/templates/Templates";
import SharedReports from "./pages/shared/SharedReports";
import Schedules from "./pages/schedules/Schedules";
import Users from "./pages/admin/Users";
import AuditLogs from "./pages/admin/AuditLogs";



function App() {
  return (
    <Routes>
      {/* ================================================= */}
      {/* PUBLIC ROUTES */}
      {/* ================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ================================================= */}
      {/* PROTECTED ROUTES */}
      {/* ================================================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/reports/create"
            element={<CreateReport />}
          />

          <Route
            path="/reports/:reportId"
            element={<ReportDetails />}
          />

          <Route
            path="/templates"
            element={<Templates />}
          />

          <Route
            path="/schedules"
            element={<Schedules />}
          />

          <Route
            path="/shared"
            element={<SharedReports />}
          />

          <Route
          path="/admin/users"
          element={<Users />}
        />

        <Route
          path="/admin/audit-logs"
          element={<AuditLogs />}
        />

        </Route>
      </Route>

      {/* ================================================= */}
      {/* FALLBACK */}
      {/* ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;