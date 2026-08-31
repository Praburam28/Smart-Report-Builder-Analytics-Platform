import {
  HistoryOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import api from "../../api/axios";

interface AuditLog {
  id: number;
  user_id: number | null;
  action: string;
  resource_type: string | null;
  resource_id: number | null;
  description: string | null;
  ip_address: string | null;
  created_at: string;
}

export default function AuditLogs() {
  const [logs, setLogs] =
    useState<AuditLog[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await api.get(
          "/api/audit-logs",
        );

        setLogs(response.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.detail ||
            "Unable to load audit logs.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        px: {
          xs: 2,
          md: 4,
        },
        py: 4,
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800 }}
        >
          Audit Logs
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Track important activities performed
          on the platform.
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {logs.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box>
              <HistoryOutlined
                sx={{
                  fontSize: 48,
                  opacity: 0.5,
                  mb: 1,
                }}
              />

              <Typography variant="h6">
                No audit logs found
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {logs.map((log) => (
            <Grid
              key={log.id}
              size={12}
            >
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {log.action}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        User ID:{" "}
                        {log.user_id ??
                          "System"}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {new Date(
                        log.created_at,
                      ).toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider
                    sx={{ my: 2 }}
                  />

                  <Typography
                    variant="body2"
                    sx={{ mb: 1 }}
                  >
                    {log.description ||
                      "No description"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Resource:{" "}
                    {log.resource_type ||
                      "N/A"}
                    {log.resource_id !==
                      null &&
                      ` #${log.resource_id}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}