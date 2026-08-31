import {
  DeleteOutlined,
  EditOutlined,
  PersonAddOutlined,
  VisibilityOutlined,
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
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import api from "../../api/axios";

interface SharedReport {
  id: number;
  report_id: number;
  shared_with_user_id: number;
  permission: string;
  shared_by: number;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface Report {
  id: number;
  name: string;
}

export default function SharedReports() {
  const [sharedReports, setSharedReports] =
    useState<SharedReport[]>([]);

  const [reports, setReports] =
    useState<Report[]>([]);

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [selectedReport, setSelectedReport] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState("");

  const [permission, setPermission] =
    useState("VIEW");

  const [saving, setSaving] =
    useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        sharedResponse,
        reportsResponse,
        usersResponse,
      ] = await Promise.all([
        api.get(
          "/api/reports/shared-with-me",
        ),
        api.get("/api/reports"),
        api.get("/api/users"),
      ]);

      setSharedReports(
        sharedResponse.data,
      );

      setReports(
        reportsResponse.data,
      );

      setUsers(
        usersResponse.data,
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load sharing data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openShareDialog = () => {
    setSelectedReport("");
    setSelectedUser("");
    setPermission("VIEW");
    setOpen(true);
  };

  const shareReport = async () => {
    if (!selectedReport) {
      setError("Please select a report.");
      return;
    }

    if (!selectedUser) {
      setError("Please select a user.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post(
        `/api/reports/${selectedReport}/share`,
        {
          user_id: Number(selectedUser),
          permission,
        },
      );

      setMessage(
        "Report shared successfully.",
      );

      setOpen(false);

      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to share report.",
      );
    } finally {
      setSaving(false);
    }
  };

  const updatePermission = async (
    item: SharedReport,
  ) => {
    const newPermission =
      item.permission === "VIEW"
        ? "EDIT"
        : "VIEW";

    try {
      await api.put(
        `/api/reports/${item.report_id}/share/${item.shared_with_user_id}`,
        {
          permission: newPermission,
        },
      );

      setMessage(
        `Permission changed to ${newPermission}.`,
      );

      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to update permission.",
      );
    }
  };

  const removeShare = async (
    item: SharedReport,
  ) => {
    if (
      !window.confirm(
        "Remove this report sharing?",
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/api/reports/${item.report_id}/share/${item.shared_with_user_id}`,
      );

      setMessage(
        "Report sharing removed.",
      );

      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to remove sharing.",
      );
    }
  };

  const getReportName = (
    reportId: number,
  ) => {
    const report = reports.find(
      (item) => item.id === reportId,
    );

    return report?.name ||
      `Report #${reportId}`;
  };

  const getUserName = (
    userId: number,
  ) => {
    const user = users.find(
      (item) => item.id === userId,
    );

    return user
      ? `${user.name} (${user.email})`
      : `User #${userId}`;
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
            Shared Reports
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage report access and
            collaboration permissions.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <PersonAddOutlined />
          }
          onClick={openShareDialog}
        >
          Share Report
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

      {/* Shared reports */}

      {sharedReports.length === 0 ? (
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
              <VisibilityOutlined
                sx={{
                  fontSize: 48,
                  mb: 1,
                  opacity: 0.5,
                }}
              />

              <Typography
                variant="h6"
                sx={{ mb: 1 }}
              >
                No shared reports
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                You don't have any shared
                reports yet.
              </Typography>

              <Button
                variant="contained"
                startIcon={
                  <PersonAddOutlined />
                }
                onClick={
                  openShareDialog
                }
              >
                Share a Report
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {sharedReports.map(
            (item) => (
              <Grid
                key={item.id}
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
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {getReportName(
                        item.report_id,
                      )}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Shared with
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {getUserName(
                        item.shared_with_user_id,
                      )}
                    </Typography>

                    <Divider
                      sx={{ my: 2 }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Permission
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      {item.permission}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={
                          <EditOutlined />
                        }
                        onClick={() =>
                          updatePermission(
                            item,
                          )
                        }
                      >
                        Change to{" "}
                        {item.permission ===
                        "VIEW"
                          ? "EDIT"
                          : "VIEW"}
                      </Button>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          removeShare(
                            item,
                          )
                        }
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ),
          )}
        </Grid>
      )}

      {/* Share dialog */}

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Share Report
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
              value={selectedReport}
              label="Report"
              onChange={(event) =>
                setSelectedReport(
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
              User
            </InputLabel>

            <Select
              value={selectedUser}
              label="User"
              onChange={(event) =>
                setSelectedUser(
                  event.target.value,
                )
              }
            >
              {users.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                  disabled={!user.is_active}
                >
                  {user.name} -{" "}
                  {user.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
          >
            <InputLabel>
              Permission
            </InputLabel>

            <Select
              value={permission}
              label="Permission"
              onChange={(event) =>
                setPermission(
                  event.target.value,
                )
              }
            >
              <MenuItem value="VIEW">
                View Only
              </MenuItem>

              <MenuItem value="EDIT">
                View & Edit
              </MenuItem>
            </Select>
          </FormControl>
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
            onClick={shareReport}
            disabled={saving}
          >
            {saving
              ? "Sharing..."
              : "Share"}
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