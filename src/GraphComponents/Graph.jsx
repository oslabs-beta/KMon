import React from "react";
import Box from "@mui/material/Box";

function Graph({ id }) {

  return (
    <Box>
      <iframe
        // an iframe with a specific URL based on the provided ID
        src={`http://localhost:3000/d-solo/eaad4742-52a8-44c1-a53b-d37453c47986/prometheus-dashboard-test?orgId=1&refresh=5s&panelId=${id}`}
        width="450"
        height="200"
        frameborder="0"
      ></iframe>
    </Box>
  );
}

export default Graph;