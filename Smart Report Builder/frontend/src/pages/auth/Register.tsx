import { useState, type FormEvent } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  AssessmentOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all required fields.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match.",
      );
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Account created successfully. Please sign in.",
        },
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        "Unable to create your account.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #F6F7FB 0%, #EEF2FF 100%)",
      }}
    >
      {/* Left panel */}
      <Box
        sx={{
          display: {
            xs: "none",
            lg: "flex",
          },
          width: "50%",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #312E81, #4F46E5 55%, #7C3AED)",
          color: "white",
          alignItems: "center",
          justifyContent: "center",
          p: 8,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.08)",
            top: -160,
            right: -100,
          }}
        />

        <Box
          sx={{
            position: "relative",
            maxWidth: 520,
          }}
        >
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 3,
              backgroundColor:
                "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <AssessmentOutlined
              sx={{ fontSize: 32 }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: 42,
              lineHeight: 1.15,
              fontWeight: 800,
              mb: 2,
            }}
          >
            Build smarter
            <br />
            reports.
          </Typography>

          <Typography
            sx={{
              fontSize: 17,
              lineHeight: 1.7,
              color:
                "rgba(255,255,255,0.78)",
            }}
          >
            Create custom reports, discover
            trends, schedule automated
            analytics, and share meaningful
            insights.
          </Typography>
        </Box>
      </Box>

      {/* Register panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: {
            xs: 2,
            sm: 4,
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 440,
            p: {
              xs: 3,
              sm: 5,
            },
            border:
              "1px solid #EAECF0",
            borderRadius: 3,
            boxShadow:
              "0 12px 40px rgba(16, 24, 40, 0.08)",
          }}
        >
          <Box
            sx={{
              display: {
                xs: "flex",
                lg: "none",
              },
              alignItems: "center",
              gap: 1.5,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, #4F46E5, #7C3AED)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
              }}
            >
              SR
            </Box>

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 17,
              }}
            >
              Smart Reports
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: 30,
              mb: 1,
            }}
          >
            Create account
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              mb: 4,
            }}
          >
            Create your Smart Reports workspace
            account.
          </Typography>

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

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              label="Full name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              autoComplete="name"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email address"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              autoComplete="new-password"
              slotProps={{
                input: {
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                        onClick={() =>
                            setShowPassword(
                            (value) => !value,
                            )
                        }
                        edge="end"
                        >
                        {showPassword ? (
                            <VisibilityOff />
                        ) : (
                            <Visibility />
                        )}
                        </IconButton>
                    </InputAdornment>
                    ),
                },
                }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirm password"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              autoComplete="new-password"
              slotProps={{
                input: {
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                        onClick={() =>
                            setShowConfirmPassword(
                            (value) => !value,
                            )
                        }
                        edge="end"
                        >
                        {showConfirmPassword ? (
                            <VisibilityOff />
                        ) : (
                            <Visibility />
                        )}
                        </IconButton>
                    </InputAdornment>
                    ),
                },
                }}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                height: 48,
                fontSize: 14,
              }}
            >
              {loading ? (
                <CircularProgress
                  size={22}
                  color="inherit"
                />
              ) : (
                "Create account"
              )}
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
              gap: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                color: "text.secondary",
              }}
            >
              Already have an account?
            </Typography>

            <Typography
              component={Link}
              to="/login"
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "primary.main",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign in
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}