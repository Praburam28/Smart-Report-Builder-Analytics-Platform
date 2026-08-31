import {
  Add,
  DeleteOutlined,
  EditOutlined,
  PlayArrow,
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
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

interface Template {
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

export default function Templates() {
  const navigate = useNavigate();

  const [templates, setTemplates] =
    useState<Template[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<Template | null>(null);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/report-templates",
      );

      setTemplates(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load templates.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setOpen(true);
  };

  const openEdit = (template: Template) => {
    setEditing(template);
    setName(template.name);
    setDescription(
      template.description || "",
    );
    setOpen(true);
  };

  const saveTemplate = async () => {
    if (name.trim().length < 2) {
      setError(
        "Template name must contain at least 2 characters.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editing) {
        await api.put(
          `/api/report-templates/${editing.id}`,
          {
            name: name.trim(),
            description:
              description.trim() || null,
          },
        );

        setMessage(
          "Template updated successfully.",
        );
      } else {
        await api.post(
          "/api/report-templates",
          {
            name: name.trim(),
            description:
              description.trim() || null,
            data_source: "users",
            configuration: {
              fields: ["id", "name", "email"],
              filters: [],
              sort: [],
              group_by: [],
            },
          },
        );

        setMessage(
          "Template created successfully.",
        );
      }

      setOpen(false);
      await loadTemplates();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to save template.",
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (
    id: number,
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this template?",
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/api/report-templates/${id}`,
      );

      setMessage(
        "Template deleted successfully.",
      );

      await loadTemplates();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to delete template.",
      );
    }
  };

  const createReport = async (
    template: Template,
  ) => {
    try {
      const response = await api.post(
        `/api/report-templates/${template.id}/create-report`,
        {
          name: `${template.name} Report`,
          description:
            template.description,
        },
      );

      setMessage(
        "Report created from template.",
      );

      setTimeout(() => {
        navigate(
          `/reports/${response.data.id}`,
        );
      }, 500);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to create report.",
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
            sx={{ fontWeight: 800 }}
          >
            Report Templates
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Reusable configurations for
            creating reports quickly.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreate}
        >
          New Template
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

      {templates.length === 0 ? (
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
              <Typography
                variant="h6"
                sx={{ mb: 1 }}
              >
                No templates yet
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Create your first reusable
                report template.
              </Typography>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={openCreate}
              >
                Create Template
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid
              key={template.id}
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
                  borderColor: "divider",
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
                    {template.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      minHeight: 42,
                    }}
                  >
                    {template.description ||
                      "No description provided."}
                  </Typography>

                  <Divider
                    sx={{ my: 2 }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Data source
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {template.data_source}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Fields
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 2 }}
                  >
                    {template.configuration.fields.join(
                      ", ",
                    )}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={
                        <PlayArrow />
                      }
                      onClick={() =>
                        createReport(
                          template,
                        )
                      }
                    >
                      Create Report
                    </Button>

                    <IconButton
                      size="small"
                      onClick={() =>
                        openEdit(template)
                      }
                    >
                      <EditOutlined />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        deleteTemplate(
                          template.id,
                        )
                      }
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editing
            ? "Edit Template"
            : "Create Template"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Template Name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            margin="normal"
            multiline
            minRows={3}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={saveTemplate}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editing
                ? "Update"
                : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={2500}
        onClose={() => setMessage("")}
        message={message}
      />
    </Box>
  );
}