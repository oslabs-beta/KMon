import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Header />
        <Sidebar />
        <Routes>
          <Route path="*" element={<Overview />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
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
