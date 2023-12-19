import React, { useContext } from "react";
import {
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import DashboardContainer from "../GraphContainers/DashboardContainer.jsx";
import { AppContext } from "../app.jsx";


const Dashboard = () => {
  const theme = useTheme();

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  const { selectedGraphs, setSelectedGraphs } = useContext(AppContext);
  
  //object with all available metrics and their corresponding IDs(IDs are from grafana)
  const allMetrics = {
    "Total Number of Bytes Allocated": 2,
    "Bytes Saved to Memory": 3,
    "Handler Request": 4,
    "Request Duration": 5,
    "Task Handlers": 6,
    "Closed Connection Rate": 7,
    "Memory Usage": 8,
  };

  //function to handle graph selection from dropdown menu
  function handleGraphSelection(event) {
    const selectedGraphId = event.target.value;
    setSelectedGraphs((prevSelected) => {
      //it adds the selected graph id to the array of already selected graphs
      return [...prevSelected, selectedGraphId];
    });
  }

  return (
    <Container sx={containerStyle}>
      <h1>This is the Dashbords Page</h1>
      <FormControl
        variant="outlined"
        style={{ width: 250 }}
        sx={{ marginBottom: "10px" }}
      >
        <InputLabel hiddenLabel={true} variant="filled">
          {" "}
          + Add Metric
        </InputLabel>
        <Select
          IconComponent={() => null}
          value={selectedGraphs}
          renderValue={() => " "}
          onChange={handleGraphSelection}
          displayEmpty
          inputProps={{ "aria-label": "Select Graphs" }}
          MenuProps={{ autoClose: true }}
        >
          {/* Maps over all metrics to create options in the dropdown */}
          {Object.entries(allMetrics).map(([metric, id]) => (
            // Dropdown menu items with metrics display text and IDs as values
            <MenuItem key={id} value={id}>
              {metric}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Renders the DashboardContainer component passing selected graphs */}
      <DashboardContainer />
    </Container>
  );
};

export default Dashboard;
