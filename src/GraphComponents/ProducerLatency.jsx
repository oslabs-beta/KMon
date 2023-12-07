import React from 'react';

function ProducerLatency() {
  return (
    <div>
      <iframe
        src='http://localhost:3000/d-solo/eaad4742-52a8-44c1-a53b-d37453c47986/prometheus-dashboard-test?orgId=1&refresh=5s&panelId=3'
        width='450'
        height='200'
        frameborder='0'
      ></iframe>
    </div>
  );
}

export default ProducerLatency;
