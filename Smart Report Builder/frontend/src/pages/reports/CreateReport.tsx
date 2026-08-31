import {
  Add,
  ArrowBack,
  DeleteOutlined,
  FilterAltOutlined,
  PlayArrow,
  SaveOutlined,
  SortOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

const availableFields = [
  "id",
  "name",
  "email",
  "role_id",
  "is_active",
  "created_at",
  "updated_at",
];

const operators = [
  "=",
  "!=",
  ">",
  "<",
  ">=",
  "<=",
  "LIKE",
  "IN",
];

interface FilterConfig {
  field: string;
  operator: string;
  value: string;
}

interface SortConfig {
  field: string;
  direction: "ASC" | "DESC";
}

export default function CreateReport() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [selectedFields, setSelectedFields] =
    useState<string[]>([
      "id",
      "name",
      "email",
    ]);

  const [filters, setFilters] =
    useState<FilterConfig[]>([]);

  const [sort, setSort] =
    useState<SortConfig[]>([]);

  const [groupBy, setGroupBy] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const toggleField = (
    field: string,
  ) => {
    setSelectedFields((current) =>
      current.includes(field)
        ? current.filter(
            (item) => item !== field,
          )
        : [...current, field],
    );
  };

  const addFilter = () => {
    setFilters((current) => [
      ...current,
      {
        field: "name",
        operator: "LIKE",
        value: "",
      },
    ]);
  };

  const updateFilter = (
    index: number,
    key: keyof FilterConfig,
    value: string,
  ) => {
    setFilters((current) =>
      current.map((filter, i) =>
        i === index
          ? {
              ...filter,
              [key]: value,
            }
          : filter,
      ),
    );
  };

  const removeFilter = (
    index: number,
  ) => {
    setFilters((current) =>
      current.filter(
        (_, i) => i !== index,
      ),
    );
  };

  const addSort = () => {
    setSort((current) => [
      ...current,
      {
        field: "name",
        direction: "ASC",
      },
    ]);
  };

  const updateSort = (
    index: number,
    key: keyof SortConfig,
    value: string,
  ) => {
    setSort((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  };

  const removeSort = (
    index: number,
  ) => {
    setSort((current) =>
      current.filter(
        (_, i) => i !== index,
      ),
    );
  };

  const toggleGroupBy = (
    field: string,
  ) => {
    setGroupBy((current) =>
      current.includes(field)
        ? current.filter(
            (item) => item !== field,
          )
        : [...current, field],
    );
  };

  const handleCreateReport =
    async () => {
      setError("");

      if (!name.trim()) {
        setError(
          "Please enter a report name.",
        );
        return;
      }

      if (
        selectedFields.length === 0
      ) {
        setError(
          "Select at least one report field.",
        );
        return;
      }

      for (const filter of filters) {
        if (!filter.value.trim()) {
          setError(
            "Please enter a value for every filter.",
          );
          return;
        }
      }

      setLoading(true);

      try {
        const payload = {
          name: name.trim(),
          description:
            description.trim() ||
            null,
          data_source: "users",
          configuration: {
            fields: selectedFields,

            filters: filters.map(
              (filter) => ({
                field: filter.field,
                operator:
                  filter.operator,
                value:
                  filter.operator ===
                  "IN"
                    ? filter.value
                        .split(",")
                        .map((item) =>
                          item.trim(),
                        )
                    : filter.value,
              }),
            ),

            sort,

            group_by: groupBy,
          },
        };

        const response =
          await api.post(
            "/api/reports",
            payload,
          );

        setSuccess(true);

        setTimeout(() => {
          navigate(
            `/reports/${response.data.id}`,
          );
        }, 700);
      } catch (err: any) {
        console.error(
          "Create report error:",
          err,
        );

        setError(
          err?.response?.data
            ?.detail ||
            "Unable to create the report.",
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Box
      sx={{
        maxWidth: 1200,
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
        }}
      >
        <IconButton
          onClick={() =>
            navigate("/reports")
          }
          sx={{
            border: "1px solid",
            borderColor:
              "divider",
          }}
        >
          <ArrowBack />
        </IconButton>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
            }}
          >
            Create Report
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Build a custom report using
            filters, sorting and grouping.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<SaveOutlined />}
          onClick={
            handleCreateReport
          }
          disabled={loading}
          sx={{
            px: 3,
            py: 1.2,
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          {loading
            ? "Creating..."
            : "Create Report"}
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Report Information */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Report Information
          </Typography>

          <Grid
            container
            spacing={2}
          >
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <TextField
                fullWidth
                label="Report Name"
                placeholder="Active Users Report"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <TextField
                fullWidth
                label="Data Source"
                value="users"
                disabled
              />
            </Grid>

            <Grid
              size={{ xs: 12 }}
            >
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Description"
                placeholder="Describe this report..."
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Fields */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Report Fields
            </Typography>

            <Chip
              size="small"
              label={`${selectedFields.length} selected`}
            />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Select the columns that should
            appear in the report.
          </Typography>

          <Grid container>
            {availableFields.map(
              (field) => (
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                  key={field}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFields.includes(
                          field,
                        )}
                        onChange={() =>
                          toggleField(
                            field,
                          )
                        }
                      />
                    }
                    label={field}
                  />
                </Grid>
              ),
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Filters */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              mb: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FilterAltOutlined />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Filters
              </Typography>
            </Box>

            <Button
              startIcon={<Add />}
              onClick={addFilter}
            >
              Add Filter
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Filter the records included in
            the report.
          </Typography>

          {filters.length === 0 && (
            <Box
              sx={{
                py: 4,
                textAlign: "center",
                border: "1px dashed",
                borderColor:
                  "divider",
                borderRadius: 2,
              }}
            >
              <Typography
                color="text.secondary"
              >
                No filters added.
              </Typography>
            </Box>
          )}

          {filters.map(
            (filter, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                  gap: 2,
                  mb: 2,
                  alignItems: {
                    xs: "stretch",
                    md: "center",
                  },
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>
                    Field
                  </InputLabel>

                  <Select
                    value={
                      filter.field
                    }
                    label="Field"
                    onChange={(event) =>
                      updateFilter(
                        index,
                        "field",
                        event.target
                          .value,
                      )
                    }
                  >
                    {availableFields.map(
                      (field) => (
                        <MenuItem
                          key={field}
                          value={field}
                        >
                          {field}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>
                    Operator
                  </InputLabel>

                  <Select
                    value={
                      filter.operator
                    }
                    label="Operator"
                    onChange={(event) =>
                      updateFilter(
                        index,
                        "operator",
                        event.target
                          .value,
                      )
                    }
                  >
                    {operators.map(
                      (operator) => (
                        <MenuItem
                          key={operator}
                          value={operator}
                        >
                          {operator}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label={
                    filter.operator ===
                    "IN"
                      ? "Values"
                      : "Value"
                  }
                  placeholder={
                    filter.operator ===
                    "IN"
                      ? "admin, user"
                      : "Enter value"
                  }
                  value={
                    filter.value
                  }
                  onChange={(event) =>
                    updateFilter(
                      index,
                      "value",
                      event.target
                        .value,
                    )
                  }
                />

                <IconButton
                  color="error"
                  onClick={() =>
                    removeFilter(
                      index,
                    )
                  }
                >
                  <DeleteOutlined />
                </IconButton>
              </Box>
            ),
          )}
        </CardContent>
      </Card>

      {/* Sorting */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <SortOutlined />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Sorting
              </Typography>
            </Box>

            <Button
              startIcon={<Add />}
              onClick={addSort}
            >
              Add Sort
            </Button>
          </Box>

          {sort.length === 0 && (
            <Typography
              color="text.secondary"
              variant="body2"
            >
              No sorting rules configured.
            </Typography>
          )}

          {sort.map(
            (item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 2,
                  mb: 2,
                  alignItems: {
                    xs: "stretch",
                    sm: "center",
                  },
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>
                    Field
                  </InputLabel>

                  <Select
                    value={
                      item.field
                    }
                    label="Field"
                    onChange={(event) =>
                      updateSort(
                        index,
                        "field",
                        event.target
                          .value,
                      )
                    }
                  >
                    {availableFields.map(
                      (field) => (
                        <MenuItem
                          key={field}
                          value={field}
                        >
                          {field}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>
                    Direction
                  </InputLabel>

                  <Select
                    value={
                      item.direction
                    }
                    label="Direction"
                    onChange={(event) =>
                      updateSort(
                        index,
                        "direction",
                        event.target
                          .value as
                          | "ASC"
                          | "DESC",
                      )
                    }
                  >
                    <MenuItem value="ASC">
                      Ascending
                    </MenuItem>

                    <MenuItem value="DESC">
                      Descending
                    </MenuItem>
                  </Select>
                </FormControl>

                <IconButton
                  color="error"
                  onClick={() =>
                    removeSort(
                      index,
                    )
                  }
                >
                  <DeleteOutlined />
                </IconButton>
              </Box>
            ),
          )}
        </CardContent>
      </Card>

      {/* Group By */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Group By
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Select fields used for grouping.
          </Typography>

          <Grid container>
            {availableFields.map(
              (field) => (
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                  key={field}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={groupBy.includes(
                          field,
                        )}
                        onChange={() =>
                          toggleGroupBy(
                            field,
                          )
                        }
                      />
                    }
                    label={field}
                  />
                </Grid>
              ),
            )}
          </Grid>

          {groupBy.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {groupBy.map(
                  (field) => (
                    <Chip
                      key={field}
                      label={field}
                      onDelete={() =>
                        toggleGroupBy(
                          field,
                        )
                      }
                    />
                  ),
                )}
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={() =>
            navigate("/reports")
          }
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={
            handleCreateReport
          }
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
          }}
        >
          {loading
            ? "Creating..."
            : "Create & Save Report"}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={1000}
        onClose={() =>
          setSuccess(false)
        }
        message="Report created successfully"
      />
    </Box>
  );
}