import {
  Add,
  DeleteOutlined,
  ScheduleOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import api from "../../api/axios";

interface Report {
  id: number;
  name: string;
}

interface Schedule {
  id: number;
  report_id: number;
  created_by: number;
  frequency: string;
  scheduled_time: string;
  day_of_week: string | null;
  day_of_month: number | null;
  is_active: boolean;
  last_run_at: string | null;
}

const weekdays = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function Schedules() {
  const [reports, setReports] =
    useState<Report[]>([]);

  const [schedules, setSchedules] =
    useState<Schedule[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [reportId, setReportId] =
    useState("");

  const [frequency, setFrequency] =
    useState("DAILY");

  const [scheduledTime, setScheduledTime] =
    useState("09:00");

  const [dayOfWeek, setDayOfWeek] =
    useState("");

  const [dayOfMonth, setDayOfMonth] =
    useState("1");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        reportsResponse,
        schedulesResponse,
      ] = await Promise.all([
        api.get("/api/reports"),
        api.get("/api/report-schedules"),
      ]);

      setReports(
        reportsResponse.data,
      );

      setSchedules(
        schedulesResponse.data,
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load schedules.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setReportId("");
    setFrequency("DAILY");
    setScheduledTime("09:00");
    setDayOfWeek("");
    setDayOfMonth("1");
    setOpen(true);
  };

  const createSchedule = async () => {
    if (!reportId) {
      setError("Please select a report.");
      return;
    }

    if (!scheduledTime) {
      setError(
        "Please select a scheduled time.",
      );
      return;
    }

    if (
      frequency === "WEEKLY" &&
      !dayOfWeek
    ) {
      setError(
        "Please select a day of the week.",
      );
      return;
    }

    if (
      frequency === "MONTHLY" &&
      !dayOfMonth
    ) {
      setError(
        "Please enter a day of the month.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload: {
        report_id: number;
        frequency: string;
        scheduled_time: string;
        day_of_week?: string;
        day_of_month?: number;
      } = {
        report_id: Number(reportId),
        frequency,
        scheduled_time: scheduledTime,
      };

      if (frequency === "WEEKLY") {
        payload.day_of_week =
          dayOfWeek;
      }

      if (frequency === "MONTHLY") {
        payload.day_of_month =
          Number(dayOfMonth);
      }

      await api.post(
        "/api/report-schedules",
        payload,
      );

      setOpen(false);

      setMessage(
        "Schedule created successfully.",
      );

      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to create schedule.",
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteSchedule = async (
    id: number,
  ) => {
    if (
      !window.confirm(
        "Delete this schedule?",
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/api/report-schedules/${id}`,
      );

      setMessage(
        "Schedule deleted successfully.",
      );

      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to delete schedule.",
      );
    }
  };

  const getReportName = (
    id: number,
  ) => {
    const report = reports.find(
      (item) => item.id === id,
    );

    return report?.name ||
      `Report #${id}`;
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
          justifyContent:
            "space-between",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
            }}
          >
            Report Schedules
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Automate report execution on a
            recurring schedule.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreate}
        >
          New Schedule
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Schedule list */}

      {schedules.length === 0 ? (
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
              minHeight: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box>
              <ScheduleOutlined
                sx={{
                  fontSize: 50,
                  mb: 1,
                  opacity: 0.5,
                }}
              />

              <Typography
                variant="h6"
                sx={{ mb: 1 }}
              >
                No schedules yet
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Schedule a report to run
                automatically.
              </Typography>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={openCreate}
              >
                Create Schedule
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {schedules.map(
            (schedule) => (
              <Grid
                key={schedule.id}
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 4,
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid",
                    borderColor:
                      "divider",
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          {getReportName(
                            schedule.report_id,
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Schedule #
                          {schedule.id}
                        </Typography>
                      </Box>

                      <IconButton
                        color="error"
                        onClick={() =>
                          deleteSchedule(
                            schedule.id,
                          )
                        }
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </Box>

                    <Divider
                      sx={{ my: 2 }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Frequency
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      {schedule.frequency}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Scheduled Time
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      {schedule.scheduled_time}
                    </Typography>

                    {schedule.day_of_week && (
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Day
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                          }}
                        >
                          {
                            schedule.day_of_week
                          }
                        </Typography>
                      </>
                    )}

                    {schedule.day_of_month && (
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Day of Month
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                          }}
                        >
                          {
                            schedule.day_of_month
                          }
                        </Typography>
                      </>
                    )}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Last Run
                    </Typography>

                    <Typography
                      variant="body2"
                    >
                      {schedule.last_run_at ||
                        "Not executed yet"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ),
          )}
        </Grid>
      )}

      {/* Create dialog */}

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Create Report Schedule
        </DialogTitle>

        <DialogContent>
          <FormControl
            fullWidth
            margin="normal"
          >
            <InputLabel>
              Report
            </InputLabel>

            <Select
              value={reportId}
              label="Report"
              onChange={(event) =>
                setReportId(
                  event.target.value,
                )
              }
            >
              {reports.map(
                (report) => (
                  <MenuItem
                    key={report.id}
                    value={report.id}
                  >
                    {report.name}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
          >
            <InputLabel>
              Frequency
            </InputLabel>

            <Select
              value={frequency}
              label="Frequency"
              onChange={(event) => {
                setFrequency(
                  event.target.value,
                );
                setDayOfWeek("");
              }}
            >
              <MenuItem value="DAILY">
                Daily
              </MenuItem>

              <MenuItem value="WEEKLY">
                Weekly
              </MenuItem>

              <MenuItem value="MONTHLY">
                Monthly
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Scheduled Time"
            type="time"
            value={scheduledTime}
            onChange={(event) =>
              setScheduledTime(
                event.target.value,
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          {frequency ===
            "WEEKLY" && (
            <FormControl
              fullWidth
              margin="normal"
            >
              <InputLabel>
                Day of Week
              </InputLabel>

              <Select
                value={dayOfWeek}
                label="Day of Week"
                onChange={(event) =>
                  setDayOfWeek(
                    event.target.value,
                  )
                }
              >
                {weekdays.map(
                  (day) => (
                    <MenuItem
                      key={day}
                      value={day}
                    >
                      {day}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          )}

          {frequency ===
            "MONTHLY" && (
            <TextField
              fullWidth
              margin="normal"
              label="Day of Month"
              type="number"
              value={dayOfMonth}
              onChange={(event) =>
                setDayOfMonth(
                  event.target.value,
                )
              }
              slotProps={{
                htmlInput: {
                  min: 1,
                  max: 31,
                },
              }}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={createSchedule}
            disabled={saving}
          >
            {saving
              ? "Creating..."
              : "Create Schedule"}
          </Button>
        </DialogActions>
      </Dialog>

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