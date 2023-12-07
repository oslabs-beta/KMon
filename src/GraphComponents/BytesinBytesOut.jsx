import React from 'react';

function BytesInBytesOut() {
  return(
    <div>
      <iframe
        src='http://localhost:3000/d-solo/eaad4742-52a8-44c1-a53b-d37453c47986/prometheus-dashboard-test?orgId=1&from=1701965579010&to=1701965879010&theme=dark&panelId=2'
        width='400'
        height='200'
        frameborder='0'
      ></iframe>
      {/* <div>Bytes in-Bytes Out</div> */}
    </div>
  );
}

export default BytesInBytesOut;
