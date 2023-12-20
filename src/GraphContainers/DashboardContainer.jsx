import React, {useContext} from "react";
import Graph from "../GraphComponents/Graph.jsx";
import Box from "@mui/material/Box";
import { useAppContext } from '../AppContext.js';

function DashboardContainer() {

  const { selectedGraphs } = useAppContext();

  // handle the case where there are no selected graphs
  if (!Array.isArray(selectedGraphs) || selectedGraphs.length === 0) {
    return null; 
  }

  return (
    <Box>
      {/* Maps over selected graphs to render Graph components */}
      {selectedGraphs.map((metric, id) => (
        // Renders Graph components with specific IDs based on what is selected
        <Graph key={id} id={metric} />
      ))}
    </Box>
  );
}
export default DashboardContainer;
