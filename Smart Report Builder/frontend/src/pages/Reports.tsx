import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AddOutlined,
  AssessmentOutlined,
  DeleteOutlined,
  PlayArrowOutlined,
  RefreshOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

interface Report {
  id: number;
  name: string;
  description: string | null;
  data_source: string;
  configuration: Record<string, unknown>;
  created_by: number;
}

export default function Reports() {
  const navigate = useNavigate();

  const [reports, setReports] =
    useState<Report[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<Report[]>(
          "/api/reports",
        );

      setReports(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load reports.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const deleteReport = async (
    reportId: number,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/api/reports/${reportId}`,
      );

      setReports((current) =>
        current.filter(
          (report) =>
            report.id !== reportId,
        ),
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to delete report.",
      );
    }
  };

  const runReport = async (
    reportId: number,
  ) => {
    try {
      const response =
        await api.post(
          `/api/reports/${reportId}/run`,
        );

      navigate(
        `/reports/${reportId}/results`,
        {
          state: {
            result: response.data,
          },
        },
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to run report.",
      );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
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
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent: "space-between",
          gap: 2,
          mb: 4,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 24,
                md: 30,
              },
              fontWeight: 800,
            }}
          >
            Reports
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "text.secondary",
              fontSize: 14,
            }}
          >
            Create, run and manage your
            custom reports.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
        >
          <Tooltip title="Refresh reports">
            <IconButton
              onClick={loadReports}
              sx={{
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <RefreshOutlined />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() =>
              navigate("/reports/create")
            }
            sx={{
              height: 42,
              px: 2.5,
            }}
          >
            Create Report
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* Empty state */}
      {reports.length === 0 ? (
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
              minHeight: 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  mx: "auto",
                  mb: 2,
                  borderRadius: 3,
                  backgroundColor:
                    "rgba(79, 70, 229, 0.08)",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AssessmentOutlined
                  sx={{ fontSize: 32 }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 750,
                  mb: 1,
                }}
              >
                No reports yet
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 14,
                  mb: 3,
                }}
              >
                Create your first custom report
                to start analyzing your data.
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddOutlined />}
                onClick={() =>
                  navigate(
                    "/reports/create",
                  )
                }
              >
                Create your first report
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        /* Report cards */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              xl: "repeat(3, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {reports.map((report) => (
            <Card
              key={report.id}
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                transition:
                  "all 0.2s ease",
                "&:hover": {
                  transform:
                    "translateY(-2px)",
                  boxShadow:
                    "0 8px 24px rgba(16,24,40,0.08)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      flexShrink: 0,
                      backgroundColor:
                        "rgba(79,70,229,0.08)",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AssessmentOutlined />
                  </Box>

                  <Chip
                    label={report.data_source}
                    size="small"
                    sx={{
                      fontSize: 11,
                      fontWeight: 650,
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    mt: 2.5,
                    fontSize: 17,
                    fontWeight: 750,
                  }}
                >
                  {report.name}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.8,
                    minHeight: 42,
                    color: "text.secondary",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  {report.description ||
                    "No description provided."}
                </Typography>

                <Divider />

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2 }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={
                      <PlayArrowOutlined />
                    }
                    onClick={() =>
                      runReport(
                        report.id,
                      )
                    }
                  >
                    Run
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        `/reports/${report.id}`,
                      )
                    }
                  >
                    View
                  </Button>

                  <Box sx={{ flex: 1 }} />

                  <Tooltip title="Delete report">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        deleteReport(
                          report.id,
                        )
                      }
                    >
                      <DeleteOutlined
                        fontSize="small"
                        />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}