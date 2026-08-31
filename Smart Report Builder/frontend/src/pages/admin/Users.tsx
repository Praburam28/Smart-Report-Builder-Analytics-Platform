import {
  BlockOutlined,
  CheckCircleOutlined,
  PeopleOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import api from "../../api/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export default function Users() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get(
          "/api/admin/users",
        );

        setUsers(response.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.detail ||
            "Unable to load users.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
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
          User Management
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Manage and monitor platform users.
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

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid
            key={user.id}
            size={{
              xs: 12,
              sm: 6,
              lg: 4,
            }}
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
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <PeopleOutlined />

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700 }}
                    >
                      {user.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      ID: {user.id}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ mb: 2 }}
                >
                  {user.email}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Chip
                    label={user.role}
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    label={
                      user.is_active
                        ? "Active"
                        : "Inactive"
                    }
                    size="small"
                    icon={
                      user.is_active ? (
                        <CheckCircleOutlined />
                      ) : (
                        <BlockOutlined />
                      )
                    }
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}