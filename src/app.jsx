import React, { useState } from 'react';
import { HashRouter, Route, Routes, Link, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Alerts from './pages/Alerts.jsx';
import Brokers from './pages/Brokers.jsx';
import Producers from './pages/Producers.jsx';
import Consumers from './pages/Consumers.jsx';
import Connections from './pages/Connections.jsx';
import Overview from './pages/Overview.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[800],
    },
  },
  typography: {
    fontFamily: 'Helvetica Neue',
  },
  Button: {
    borderRadius: '8px',
  },
});

const App = () => {
  // TO DO: uncomment and set isLoggedIn to false for production setting
  // const [isLoggedIn, setLoggedIn] = useState(false);

  // For development mode, isLoggedIn is set to true
  const [isLoggedIn, setLoggedIn] = useState(true);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        {isLoggedIn && (
          <>
            <Header onLogout={handleLogout} />
            <Sidebar />
          </>
        )}
        <Routes>
          <Route path="/Login" element={<Login onLogin={handleLogin} />} />
          <Route path="/Signup" element={<Signup onLogin={handleLogin} />} />
          {isLoggedIn ? (
            <>
              <Route path="/Connections" element={<Connections />} />
              <Route path="/Alerts" element={<Alerts />} />
              <Route path="/Brokers" element={<Brokers />} />
              <Route path="/Producers" element={<Producers />} />
              <Route path="/Consumers" element={<Consumers />} />
              <Route path="/Overview" element={<Overview />} />
              <Route path="*" element={<Navigate to="/Overview" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/Login" />} />
          )}
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;