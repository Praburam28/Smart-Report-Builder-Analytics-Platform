import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const {
    user,
    token,
    authChecking,
  } = useAuth();

  const location = useLocation();

  console.log("PROTECTED ROUTE:", {
    user,
    token,
    authChecking,
    path: location.pathname,
  });

  if (authChecking) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress />

        <Typography
          sx={{
            fontSize: 13,
            color: "text.secondary",
          }}
        >
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  if (!token || !user) {
    console.log(
      "PROTECTED ROUTE: Redirecting to login",
    );

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  console.log(
    "PROTECTED ROUTE: Access granted",
  );

  return <Outlet />;
}