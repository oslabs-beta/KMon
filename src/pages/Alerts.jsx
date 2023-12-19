import React, { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../AppContext.js';

// TO DO: confirm apiUrl for production
const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.kmon.com'
    : 'http://localhost:3010';

const Alerts = () => {
  const theme = useTheme();

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  const StyledForm = styled('form')({
    "& .MuiTextField-root": { 
      margin: "1",
      display: 'block',
    },
    "& .MuiButton-root": {
      marginLeft: "10px",
      marginTop: "10px",
    },
  });

  const [loading, setLoading] = useState(false);
  const { updateUserInfo } = useAppContext();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch(`${apiUrl}/alert/alertsInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailAddress: event.target.emailAddress.value,
          appPassword: event.target.appPassword.value,
        }),
      });
  
      if (response.ok) {
        // Handle success, maybe update state or show a success message
      } else {
        console.error('Failed to submit form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  

  return (
    <Container sx={containerStyle}>
      <div>
        <section id="alertsContainer">
          <div className="formContainer">
            <StyledForm onSubmit={handleFormSubmit}>
              <TextField
                id='emailAddress'
                label='Enter email for email alerts'
                variant='outlined'
                margin='normal'
                name='emailAddress'
                sx={{ width: '400px' }}
              />
              <TextField
                id='appPassword'
                label='Enter app password for email alerts'
                variant='outlined'
                margin='normal'
                name='appPassword'
                sx={{ width: '600px' }}
              />
              <Button
                variant='contained'
                color='primary'
                type='submit'
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </StyledForm>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default Alerts;