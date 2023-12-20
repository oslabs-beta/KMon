import React from "react";
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
import { useAppContext } from "../AppContext.js";

const Dashboard = () => {
  const theme = useTheme();

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  const { selectedGraphs, setSelectedGraphs } = useAppContext();
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
  //object with reversed values. it is for backend
  // const reverseMetrics = {
  //   2: "Total Number of Bytes Allocated",
  //   3: "Bytes Saved to Memory",
  //   4: "Handler Request",
  //   5: "Request Duration",
  //   6: "Task Handlers",
  //   7: "Closed Connection Rate",
  //   8: "Memory Usage",
  // };
  //fetch GET :
  //the logic here for when the user logs out and then logs back in again, the graphs that he has selected before loging out.
  // useEffect(() => {
  //   if (userInfo) {
  //     fetch(`${apiUrl}/allgraph`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("graphs: ", data);
  //         setSelectedGraphs(data.SelectedGraphs);
  //       })
  //       .catch((error) => {
  //         console.log("Error fetching user's selected graphs:", error);
  //       });
  //   }
  // }, [userInfo]);

  // TO DO: confirm apiUrl for production
  // const apiUrl =
  //   process.env.NODE_ENV === "production"
  //     ? "https://api.kmon.com"
  //     : "http://localhost:3010";

  //function to handle graph selection from dropdown menu
  function handleGraphSelection(event) {
    const selectedGraphId = event.target.value;

    //it is a back end logic to do a post request for one graph in graphs table in db
    // if (userInfo) {
    //   console.log("hi4");
    //   fetch(`${apiUrl}/graph/creategraph`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ graph_id: selectedGraphId, metric_name: reverseMetrics[selectedGraphId] , user_id: userInfo.userID }),
    //   })
    //     .then(
    //       (response) =>
    //       {
    //         console.log("in .then. Response received?");
    //         response.json();
    //       if(response.ok) {
    // Update the frontend state
    setSelectedGraphs((prevSelected) => {
      //it adds the selected graph id to the array of already selected graphs
      return [...prevSelected, selectedGraphId];
    });
    //         } else {
    //           throw new Error ('Failed to post selected graphs')
    //         }
    //         }
    //       )
    //       .catch((error) => {
    //         console.log("Error posting selected graphs:", error);
    //         console.log("in catch");
    //       });
    //   } else {
    //     //logic for when not logged in
    //     console.log("User context not available");
    //   }
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
