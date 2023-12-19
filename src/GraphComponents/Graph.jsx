import React,  { useEffect } from "react";
import Box from "@mui/material/Box";

function Graph({ id }) {

  // useEffect(()=> {
  //   fetch(`${apiUrl}/graph`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       graph_id: graph_id,
  //       user_id:user_id,
  //       metric_name: metric_name,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("created graph: ", data);
  //     })
  //     .catch((error) => {
  //       console.log("Error creating graph: ", error);
  //     });
  // }, [id])
      
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