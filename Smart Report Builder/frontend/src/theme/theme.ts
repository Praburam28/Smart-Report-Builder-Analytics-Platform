import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#4F46E5",
    },

    secondary: {
      main: "#7C3AED",
    },

    background: {
      default: "#F6F7FB",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#172033",
      secondary: "#667085",
    },
  },

  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #EAECF0",
          boxShadow: "0 2px 10px rgba(16, 24, 40, 0.04)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 9,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: "#F9FAFB",
        },
      },
    },
  },
});

export default theme;