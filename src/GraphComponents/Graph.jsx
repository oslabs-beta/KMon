import React from 'react';
import Box from '@mui/material/Box';

function Graph({ id }) {
  return (
    <>
      <iframe
        // an iframe with a specific URL based on the provided ID
        src={`http://localhost:3000/d-solo/ab97a8cb-08c6-4f4b-a81e-3cf22b397855/dashboard?orgId=1&theme=dark&panelId=${id}`}
        frameborder='0'
        style={{ pointerEvents: 'none', flexGrow: 1 }}
      ></iframe>
    </>
  );
}

export default Graph;
