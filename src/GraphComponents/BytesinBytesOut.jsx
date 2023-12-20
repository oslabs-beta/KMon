import React, { useState, useEffect, useContext } from 'react';
// import DashboardContext from '../context/DashboardContext';

function BytesInBytesOut() {
    return (
      <>
        <iframe
          src='http://localhost:3000/d-solo/eaad4742-52a8-44c1-a53b-d37453c47986/prometheus-dashboard-test?orgId=1&refresh=5s&panelId=2'
          frameborder='0'
          style={{pointerEvents: 'none', flexGrow: 1}}
        ></iframe>
      </>
    );
}

export default BytesInBytesOut;
