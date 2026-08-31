import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  AssessmentOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  PlayCircleOutlined,
  RefreshOutlined,
  TrendingUp,
} from "@mui/icons-material";

import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

import api from "../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

interface DashboardSummary {
  total_reports: number;
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
}

interface RecentReport {
  id: number;
  name: string;
  data_source: string;
  created_at: string;
}

interface FrequentlyUsedReport {
  report_id: number;
  report_name: string;
  execution_count: number;
}

interface ExecutionStatistics {
  date: string;
  successful: number;
  failed: number;
}

interface DashboardResponse {
  summary: DashboardSummary;
  recent_reports: RecentReport[];
  frequently_used_reports: FrequentlyUsedReport[];
  execution_statistics: ExecutionStatistics[];
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
}

function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 8px 24px rgba(16, 24, 40, 0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
              backgroundColor:
                "rgba(79, 70, 229, 0.08)",
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          sx={{
            mt: 2,
            fontSize: 30,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {value.toLocaleString()}
        </Typography>

        <Typography
          sx={{
            mt: 1.5,
            fontSize: 12,
            color: "text.secondary",
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<DashboardResponse>(
          "/api/dashboard",
        );

      setDashboard(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const chartData = useMemo(() => {
    if (!dashboard) {
      return {
        labels: [],
        datasets: [],
      };
    }

    return {
      labels:
        dashboard.execution_statistics.map(
          (item) => item.date,
        ),

      datasets: [
        {
          label: "Successful",
          data:
            dashboard.execution_statistics.map(
              (item) => item.successful,
            ),
          tension: 0.4,
          fill: true,
        },
        {
          label: "Failed",
          data:
            dashboard.execution_statistics.map(
              (item) => item.failed,
            ),
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [dashboard]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
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

  if (error) {
    return (
      <Box>
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
          }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={loadDashboard}
            >
              <RefreshOutlined fontSize="small" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!dashboard) {
    return null;
  }

  const {
    summary,
    recent_reports,
    frequently_used_reports,
  } = dashboard;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: {
              xs: 24,
              md: 30,
            },
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          Dashboard
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: "text.secondary",
            fontSize: 14,
          }}
        >
          Overview of your reports and analytics
          activity.
        </Typography>
      </Box>

      {/* Statistics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 2.5,
          mb: 3,
        }}
      >
        <StatCard
          title="Total Reports"
          value={summary.total_reports}
          description="Reports created by you"
          icon={<AssessmentOutlined />}
        />

        <StatCard
          title="Total Executions"
          value={summary.total_executions}
          description="All report executions"
          icon={<PlayCircleOutlined />}
        />

        <StatCard
          title="Successful"
          value={
            summary.successful_executions
          }
          description="Successfully completed"
          icon={<CheckCircleOutlined />}
        />

        <StatCard
          title="Failed"
          value={summary.failed_executions}
          description="Failed executions"
          icon={<ErrorOutlined />}
        />
      </Box>

      {/* Analytics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 2fr) minmax(300px, 1fr)",
          },
          gap: 3,
          mb: 3,
        }}
      >
        {/* Execution analytics */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    "rgba(79, 70, 229, 0.08)",
                  color: "primary.main",
                }}
              >
                <TrendingUp />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 750,
                  }}
                >
                  Execution Analytics
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    color: "text.secondary",
                  }}
                >
                  Report execution performance
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: 330 }}>
              {dashboard.execution_statistics
                .length > 0 ? (
                <Line
                  data={chartData}
                  options={chartOptions}
                />
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  <Typography sx={{ fontSize: 14 }}>
                    No execution data available yet.
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Frequently used */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 750,
              }}
            >
              Frequently Used
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "text.secondary",
                mt: 0.5,
                mb: 2,
              }}
            >
              Your most executed reports
            </Typography>

            <Divider />

            {frequently_used_reports.length ===
            0 ? (
              <Box sx={{ py: 5 }}>
                <Typography
                  align="center"
                  sx={{
                    fontSize: 13,
                    color: "text.secondary",
                  }}
                >
                  No execution history yet.
                </Typography>
              </Box>
            ) : (
              <Stack>
                {frequently_used_reports.map(
                  (report, index) => (
                    <Box
                      key={report.report_id}
                      sx={{
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        borderBottom:
                          index !==
                          frequently_used_reports.length -
                            1
                            ? "1px solid"
                            : "none",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: 2,
                          backgroundColor:
                            "rgba(79, 70, 229, 0.08)",
                          color: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        {index + 1}
                      </Box>

                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            fontSize: 13,
                            fontWeight: 650,
                          }}
                        >
                          {report.report_name}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "text.secondary",
                          }}
                        >
                          {report.execution_count}{" "}
                          executions
                        </Typography>
                      </Box>
                    </Box>
                  ),
                )}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Recent reports */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 750,
                }}
              >
                Recent Reports
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "text.secondary",
                  mt: 0.5,
                }}
              >
                Recently created reports
              </Typography>
            </Box>
          </Box>

          <Divider />

          {recent_reports.length === 0 ? (
            <Box sx={{ py: 5 }}>
              <Typography
                align="center"
                sx={{
                  fontSize: 14,
                  color: "text.secondary",
                }}
              >
                No reports created yet.
              </Typography>
            </Box>
          ) : (
            <Stack>
              {recent_reports.map(
                (report, index) => (
                  <Box
                    key={report.id}
                    sx={{
                      py: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderBottom:
                        index !==
                        recent_reports.length - 1
                          ? "1px solid"
                          : "none",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        backgroundColor:
                          "rgba(79, 70, 229, 0.08)",
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AssessmentOutlined />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 650,
                        }}
                      >
                        {report.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "text.secondary",
                          mt: 0.3,
                        }}
                      >
                        Data source:{" "}
                        {report.data_source}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    >
                      {new Date(
                        report.created_at,
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                ),
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}