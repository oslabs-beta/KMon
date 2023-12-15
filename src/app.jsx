import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Alerts from "./pages/Alerts.jsx";
import Brokers from "./pages/Brokers.jsx";
import Producers from "./pages/Producers.jsx";
import Consumers from "./pages/Consumers.jsx";
import Connections from "./pages/Connections.jsx";
import Overview from "./pages/Overview.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple, indigo, grey, blueGrey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[800],
    },
    secondary: {
      main: indigo[200],
    },
    customColor: {
      main: deepPurple[600],
      light: grey[400],
      dark: blueGrey[700],
    },
  },
  typography: {
    fontFamily: "Helvetica Neue",
  },
  spacing: 8,
  margins: {
    defaultMargin: 8,
    largeMargin: 16,
    smallMargin: 4,
    sideBarMargin: 30,
    headerMargin: 3.75,
  },
  breakpoints: {
    values: {
      //for different screen sizes. (<Grid item xs={12} sm={6} md={4} lg={3}>)
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          contained: {
            backgroundColor: deepPurple[800],
            "&:hover": {
              backgroundColor: deepPurple[600],
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Header />
        <Sidebar />
        <Routes>
          <Route path="*" element={<Overview />} />
          <Route path="/Connections" element={<Connections />} />
          <Route path="/Alerts" element={<Alerts />} />
          <Route path="/Brokers" element={<Brokers />} />
          <Route path="/Producers" element={<Producers />} />
          <Route path="/Consumers" element={<Consumers />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
