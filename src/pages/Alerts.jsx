import React from "react";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import { styled } from '@mui/system';

const Alerts = () => {
  const containerStyle = {
    marginLeft: "240px",
    marginTop: "30px",
  };

  const StyledForm = styled(Box)({
    "& .MuiTextField-root": { 
      margin: "1", 
      width: "25ch" },
  });

  const StyledButton = styled(Button)({
    borderRadius: "8px",
    marginLeft: "10px",
  });

  return (
    <Container sx={containerStyle}>
      <h1>This is the Alerts Page</h1>
      <StyledForm component="form"> 
        <TextField
          helperText="Enter your email here"
          id="enter-email"
          label="email"
        />
        <br/>
        <TextField
          helperText="Enter your app password for email alerts"
          id="enter-password"
          label="app password"
        />
      <br/>
      </StyledForm>
      <StyledButton variant = "contained"
        onClick={() => {alert('Your form was submitted');
        }}
      >
        Submit
      </StyledButton>
    </Container>
  );
};

export default Alerts;
