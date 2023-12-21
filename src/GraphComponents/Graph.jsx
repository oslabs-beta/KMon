import React from "react";
import Box from "@mui/material/Box";

function Graph({ id }) {

  return (
    <>
      <iframe
        // an iframe with a specific URL based on the provided ID
        src={`http://localhost:3000/d-solo/eaad4742-52a8-44c1-a53b-d37453c47986/prometheus-dashboard-test?orgId=1&refresh=5s&panelId=${id}`}
        frameborder="0"
        style={{pointerEvents: 'none', flexGrow: 1}}
      ></iframe>
    </>
  );
}

export default Graph;