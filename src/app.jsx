import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from "./Sidebar.jsx"
import Header from "./Header.jsx"
import Alerts from './Alerts.jsx';
import Brokers from './Brokers.jsx';
import Producers from './Producers.jsx';
import Consumers from './Consumers.jsx';

function App() {
    return (
      <>
      {/* <Router> */}
        <Header />
        <Sidebar />
        njkvghv
            {/* <Routes>
            <Route  path="/alerts" element={<Alerts />} />
            <Route  path="/brokers" element={<Brokers />} />
            <Route  path="/producers" element={<Producers />} />
            <Route  path="/consumers" element={<Consumers />} />
            </Routes>
      </Router> */}
      </>
    );
  }

export default App