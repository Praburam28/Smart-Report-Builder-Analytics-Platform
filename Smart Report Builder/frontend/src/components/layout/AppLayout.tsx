import { useState, type ReactNode } from "react";

import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AssessmentOutlined,
  DashboardOutlined,
  DescriptionOutlined,
  EventOutlined,
  HistoryOutlined,
  Logout,
  Menu,
  PeopleOutlined,
  ShareOutlined,
} from "@mui/icons-material";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const drawerWidth = 250;

const mainNavigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlined />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <AssessmentOutlined />,
  },
  {
    label: "Templates",
    path: "/templates",
    icon: <DescriptionOutlined />,
  },
  {
    label: "Schedules",
    path: "/schedules",
    icon: <EventOutlined />,
  },
  {
    label: "Shared Reports",
    path: "/shared",
    icon: <ShareOutlined />,
  },
];

const adminNavigation = [
  {
    label: "Users",
    path: "/admin/users",
    icon: <PeopleOutlined />,
  },
  {
    label: "Audit Logs",
    path: "/admin/audit-logs",
    icon: <HistoryOutlined />,
  },
];

export default function AppLayout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = getPageTitle(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigationContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          height: 72,
          display: "flex",
          alignItems: "center",
          px: 3,
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            background:
              "linear-gradient(135deg, #4F46E5, #7C3AED)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            fontSize: 18,
          }}
        >
          SR
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 15,
              color: "text.primary",
            }}
          >
            Smart Reports
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              color: "text.secondary",
            }}
          >
            Analytics Platform
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2 }}>
        <Typography
          sx={{
            px: 3,
            mb: 1,
            fontSize: 11,
            fontWeight: 700,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Workspace
        </Typography>

        <List sx={{ px: 1.5 }}>
          {mainNavigation.map((item) => (
            <NavigationItem
              key={item.path}
              {...item}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </List>

        {user?.role === "ADMIN" && (
          <>
            <Typography
              sx={{
                px: 3,
                mt: 3,
                mb: 1,
                fontSize: 11,
                fontWeight: 700,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              Administration
            </Typography>

            <List sx={{ px: 1.5 }}>
              {adminNavigation.map((item) => (
                <NavigationItem
                  key={item.path}
                  {...item}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </List>
          </>
        )}
      </Box>

      {/* User section */}
      <Box sx={{ p: 1.5 }}>
        <Divider sx={{ mb: 1.5 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1,
            py: 1,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Box
            sx={{
              ml: 1.5,
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              noWrap
              sx={{
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {user?.name}
            </Typography>

            <Typography
              noWrap
              sx={{
                fontSize: 11,
                color: "text.secondary",
              }}
            >
              {user?.email}
            </Typography>
          </Box>

          <Tooltip title="Logout">
            <IconButton
              size="small"
              onClick={handleLogout}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Desktop sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #EAECF0",
          },
        }}
      >
        {navigationContent}
      </Drawer>

      {/* Mobile sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        {navigationContent}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          backgroundColor: "background.default",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "background.paper",
            borderBottom: "1px solid #EAECF0",
            color: "text.primary",
          }}
        >
          <Toolbar
            sx={{
              minHeight: "72px !important",
              px: {
                xs: 2,
                md: 4,
              },
            }}
          >
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                display: {
                  xs: "inline-flex",
                  md: "none",
                },
                mr: 1,
              }}
            >
              <Menu />
            </IconButton>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 750,
                }}
              >
                {pageTitle}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "text.secondary",
                }}
              >
                Smart Report Builder
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: "primary.main",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

interface NavigationItemProps {
  label: string;
  path: string;
  icon: ReactNode;
  onNavigate: () => void;
}

function NavigationItem({
  label,
  path,
  icon,
  onNavigate,
}: NavigationItemProps) {
  return (
    <ListItemButton
      component={NavLink}
      to={path}
      onClick={onNavigate}
      sx={{
        mb: 0.5,
        minHeight: 44,
        borderRadius: 2,
        color: "text.secondary",

        "& .MuiListItemIcon-root": {
          minWidth: 38,
          color: "inherit",
        },

        "&.active": {
          color: "primary.main",
          backgroundColor: "rgba(79, 70, 229, 0.08)",
          fontWeight: 700,
        },

        "&:hover": {
          backgroundColor: "rgba(79, 70, 229, 0.05)",
        },
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>

      <ListItemText
        primary={
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {label}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

function getPageTitle(path: string): string {
  if (path.startsWith("/reports")) {
    return "Reports";
  }

  if (path.startsWith("/templates")) {
    return "Report Templates";
  }

  if (path.startsWith("/schedules")) {
    return "Report Schedules";
  }

  if (path.startsWith("/shared")) {
    return "Shared Reports";
  }

  if (path.startsWith("/admin/users")) {
    return "User Management";
  }

  if (path.startsWith("/admin/audit-logs")) {
    return "Audit Logs";
  }

  return "Dashboard";
}