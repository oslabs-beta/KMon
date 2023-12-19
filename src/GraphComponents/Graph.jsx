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

//fetch GET :
fetch("/graph")
  .then((response) => response.json())
  .then((data) => {
    console.log("graphs: ", data);
  })
  .catch((error) => {
    console.log("Error fetching graphs:", error);
  });

//fetch POST :
const graphData = {
  graph_id: 1,
  user_id: 123,
  metric_name: "Sample Metric",
};

fetch("/graph", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(graphData),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("created graph: ", data);
  })
  .catch((error) => {
    console.log("Error creating graph: ", error);
  });
