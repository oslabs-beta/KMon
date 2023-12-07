import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Sidebar from './components/Sidebar.jsx';;
import Header from './components/Header.jsx';;
import Alerts from "./pages/Alerts.jsx";
import Brokers from "./pages/Brokers.jsx";
import Producers from "./pages/Producers.jsx";
import Consumers from "./pages/Consumers.jsx";
import Connections from './pages/Connections.jsx';
import Overview from "./pages/Overview.jsx";

function App() {
  return (
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
  );
}

export default App;
;
