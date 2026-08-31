import {
  ArrowBack,
  DeleteOutlined,
  DownloadOutlined,
  PlayArrow,
  Refresh,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";

interface Report {
  id: number;
  name: string;
  description: string | null;
  data_source: string;
  configuration: {
    fields: string[];
    filters?: unknown[];
    sort?: unknown[];
    group_by?: string[];
  };
  created_by: number;
}

interface ReportResult {
  report_id: number;
  report_name: string;
  data_source: string;
  columns: string[];
  rows: Record<string, unknown>[];
  total_records: number;
}

export default function ReportDetails() {
  const { reportId } = useParams<{
    reportId: string;
  }>();

  const navigate = useNavigate();

  const [report, setReport] =
    useState<Report | null>(null);

  const [result, setResult] =
    useState<ReportResult | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [running, setRunning] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const loadReport = async () => {
      if (!reportId) {
        setError("Invalid report ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/api/reports/${reportId}`,
        );

        setReport(response.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.detail ||
            "Unable to load report.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [reportId]);

  const runReport = async () => {
    if (!reportId) return;

    try {
      setRunning(true);
      setError("");

      const response = await api.post(
        `/api/reports/${reportId}/run`,
      );

      setResult(response.data);
      setMessage(
        "Report executed successfully.",
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to execute report.",
      );
    } finally {
      setRunning(false);
    }
  };

  const deleteReport = async () => {
    if (!reportId) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this report?",
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/api/reports/${reportId}`,
      );

      navigate("/reports");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to delete report.",
      );
    }
  };

  const downloadReport = async (
    format: "csv" | "excel" | "pdf",
  ) => {
    if (!reportId) return;

    try {
      const response = await api.get(
        `/api/reports/${reportId}/export/${format}`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([
        response.data,
      ]);

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      const extension =
        format === "excel"
          ? "xlsx"
          : format;

      link.download =
        `${report?.name || "report"}.${extension}`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(
        `Unable to export ${format.toUpperCase()}.`,
      );
    }
  };

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

  if (!report) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          {error || "Report not found."}
        </Alert>

        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/reports")
          }
        >
          Back to Reports
        </Button>
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
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <IconButton
          onClick={() =>
            navigate("/reports")
          }
        >
          <ArrowBack />
        </IconButton>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800 }}
          >
            {report.name}
          </Typography>

          <Typography
            color="text.secondary"
          >
            {report.description ||
              "Custom report"}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            running ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : (
              <PlayArrow />
            )
          }
          onClick={runReport}
          disabled={running}
        >
          {running
            ? "Running..."
            : "Run Report"}
        </Button>

        <IconButton
          color="error"
          onClick={deleteReport}
        >
          <DeleteOutlined />
        </IconButton>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Configuration */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Report Configuration
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Data Source
          </Typography>

          <Typography
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            {report.data_source}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Selected Fields
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {report.configuration.fields.map(
              (field) => (
                <Box
                  key={field}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor:
                      "action.hover",
                  }}
                >
                  {field}
                </Box>
              ),
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Results */}

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
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Report Results
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {result
                  ? `${result.total_records} records`
                  : "Run the report to view results"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Button
                size="small"
                variant="outlined"
                startIcon={<Refresh />}
                onClick={runReport}
                disabled={running}
              >
                Refresh
              </Button>

              <Button
                size="small"
                variant="outlined"
                startIcon={
                  <DownloadOutlined />
                }
                onClick={() =>
                  downloadReport("csv")
                }
                disabled={!result}
              >
                CSV
              </Button>

              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  downloadReport("excel")
                }
                disabled={!result}
              >
                Excel
              </Button>

              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  downloadReport("pdf")
                }
                disabled={!result}
              >
                PDF
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {!result && (
            <Box
              sx={{
                minHeight: 250,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 1 }}
                >
                  No results yet
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Click Run Report to
                  execute this report.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={runReport}
                  disabled={running}
                >
                  Run Report
                </Button>
              </Box>
            </Box>
          )}

          {result && (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                maxHeight: 600,
              }}
            >
              <Table
                stickyHeader
                size="small"
              >
                <TableHead>
                  <TableRow>
                    {result.columns.map(
                      (column) => (
                        <TableCell
                          key={column}
                          sx={{
                            fontWeight: 700,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {column}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {result.rows.length ===
                    0 && (
                    <TableRow>
                      <TableCell
                        colSpan={
                          result.columns.length
                        }
                        align="center"
                      >
                        No records found.
                      </TableCell>
                    </TableRow>
                  )}

                  {result.rows.map(
                    (row, index) => (
                      <TableRow
                        key={index}
                        hover
                      >
                        {result.columns.map(
                          (column) => (
                            <TableCell
                              key={column}
                            >
                              {String(
                                row[column] ??
                                  "",
                              )}
                            </TableCell>
                          ),
                        )}
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={2500}
        onClose={() =>
          setMessage("")
        }
        message={message}
      />
    </Box>
  );
}