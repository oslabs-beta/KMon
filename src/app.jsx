import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Sidebar from "./Sidebar.jsx"
import Header from "./Header.jsx"
import Alerts from './Alerts.jsx';
import Brokers from './Brokers.jsx';
import Producers from './Producers.jsx';
import Consumers from './Consumers.jsx';
import Overview from './Overview.jsx';

function App() {
    return (
      <HashRouter>
        <Header />
        <Sidebar />
            <Routes>
            <Route  path="*" element={<Overview />} />
            <Route  path="/Alerts" element={<Alerts />} />
            <Route  path="/Brokers" element={<Brokers />} />
            <Route  path="/Producers" element={<Producers />} />
            <Route  path="/Consumers" element={<Consumers />} />
            </Routes>
      </HashRouter>
    );
  }

export default App