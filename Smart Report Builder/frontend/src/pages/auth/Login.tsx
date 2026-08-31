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

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password.",
      );
      return;
    }

    try {
      await login(
        email.trim(),
        password,
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        "Unable to sign in. Please check your credentials.";

      setError(message);
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
      {/* Left branding panel */}
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
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.06)",
            bottom: -100,
            left: -100,
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
              border:
                "1px solid rgba(255,255,255,0.25)",
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
            Turn your data
            <br />
            into insights.
          </Typography>

          <Typography
            sx={{
              fontSize: 17,
              lineHeight: 1.7,
              color:
                "rgba(255,255,255,0.78)",
              maxWidth: 450,
            }}
          >
            Build powerful custom reports,
            visualize your data, schedule
            reports, and share insights with
            your team.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mt: 5,
              flexWrap: "wrap",
            }}
          >
            {[
              "Custom Reports",
              "Analytics",
              "Scheduling",
              "Exports",
            ].map((item) => (
              <Box
                key={item}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 5,
                  background:
                    "rgba(255,255,255,0.1)",
                  border:
                    "1px solid rgba(255,255,255,0.15)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {item}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Login panel */}
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
          {/* Mobile logo */}
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
              fontSize: {
                xs: 28,
                sm: 32,
              },
              mb: 1,
            }}
          >
            Welcome back
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              mb: 4,
            }}
          >
            Sign in to your analytics workspace.
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
              label="Email address"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              sx={{ mb: 2.5 }}
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
              autoComplete="current-password"
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
                        aria-label="toggle password visibility"
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
                boxShadow:
                  "0 4px 12px rgba(79,70,229,0.25)",
              }}
            >
              {loading ? (
                <CircularProgress
                  size={22}
                  color="inherit"
                />
              ) : (
                "Sign in"
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
              Don't have an account?
            </Typography>

            <Typography
              component={Link}
              to="/register"
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
              Create account
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}