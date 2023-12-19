import React, { useContext, useEffect } from "react";
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

  //fetch GET :
  //the logic here for when the user logs out and then logs back in again, the graphs that he has selected before loging out.
  useEffect(() => {
    if (user) {
      fetch(`${apiUrl}/user/graph`, {
        method: "GET",
        headers: {
          Authorization: `${user.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("graphs: ", data);
          setSelectedGraphs(data.SelectedGraphs);
        })
        .catch((error) => {
          console.log("Error fetching graphs:", error);
        });
    }
  }, [user, setSelectedGraphs]);

  //function to handle graph selection from dropdown menu
  function handleGraphSelection(event) {
    const selectedGraphId = event.target.value;
    if (user) {
      fetch(`${apiUrl}/graph`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.token}`,
        },
        body: JSON.stringify({selectedGraphId}),
      })
        .then((response) => {
          if(response.ok) {
            setSelectedGraphs((prevSelected) => {
              //it adds the selected graph id to the array of already selected graphs
              return [...prevSelected, selectedGraphId];
        })
    } else {
      throw new Error ('graphs are not available')
      //logic for when not logged in
    }
    })
    .catch ((error) => {
      console.log()
    })
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