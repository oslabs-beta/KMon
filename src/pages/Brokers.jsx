import React, { useContext  } from "react";
import { Container, Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import BrokerContainer from "../GraphContainers/BrokerContainer.jsx";
import { AppContext } from "../app.jsx";

const Brokers = () => {
  const theme = useTheme();

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  const {
    selectedGraphs,
    setSelectedGraphs,
  } = useContext(AppContext)

  //object with available brokers metrics and their corresponding IDs(IDs are from grafana)
  const brokerMetrics = {
    "Total Number of Bytes Allocated": 2,
    "Bytes Saved to Memory": 3,
    "Handler Request": 4,
    "Request Duration": 5,
    "Task Handlers": 6,
    "Closed Connection Rate": 7,
    "Memory Usage": 8,
  };
  

  //GET request here

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
      <h1>This is the Brokers Page</h1>
      <FormControl variant = 'outlined' style={{ width: 200 }}>
      <InputLabel hiddenLabel = {true} variant="filled" >Select Metric</InputLabel>
      <Select
        value = {selectedGraphs}
        onChange={handleGraphSelection}
        displayEmpty
        inputProps={{ "aria-label": "Select Graphs" }}
        MenuProps={{ autoClose: true }}
      >
        {/* Maps over broker metrics to create options in the dropdown */}
        {Object.entries(brokerMetrics).map(([metric, id]) => (
          // Dropdown menu items with metrics display text and IDs as values
          <MenuItem key={id} value={id}>
            {metric}
          </MenuItem>
        ))}
      </Select>
      </FormControl>
      {/* Renders the BrokerContainer component passing selected graphs */}
      <BrokerContainer />
    </Container>
  );
};

export default Brokers;