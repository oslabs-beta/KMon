import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../AppContext.js';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.kmon.com'
    : 'http://localhost:3010';

const AlertSettings = () => {
  const theme = useTheme();
  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  const [password, setPassword] = useState('');
  // Initialize alert preferences to false for the form
  const [alertPreferences, setAlertPreferences] = useState({
    Email: false,
    Slack: false,
    InApp: false,
  });
  // Provide feedback to the user once response is received from database
  const [settingsFeedback, setSettingsFeedback] = useState(null);
  // Slack URL and Email are required if the user has selected the checkboxes for them
  const isSlackURLRequired = alertPreferences['Slack'];
  const isEmailRequired = alertPreferences['Email'];
  // Store previously saved preferences, updated when userInfo is retrieved from global state or settingsFeedback is updated after form submission
  const [savedPreferences, setSavedPreferences] = useState({});

  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleAlertChange = (type) => {
    setAlertPreferences((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Use global context to access user info
  const { userInfo, updateUserInfo } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/alert/get-preferences/${userInfo.userID}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (response.ok) {
          const preferencesData = await response.json();
          setSavedPreferences(preferencesData.data.preferences);
          // console.log('Alert preferences received.');
        }
      } catch (error) {
        console.error('Error while getting saved alert preferences:', error);
      }
    };
  
    // Fetch data when user is on Settings page. Optional chaining to allow reading the value of userInfo.userID even if userInfo is null or undefined without causing an error.
    if (userInfo?.userID) {
      fetchData();
    }
  }, [userInfo?.userID, settingsFeedback]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check to see if any changes were made before API call
    const changesMade =
      JSON.stringify(alertPreferences) !== JSON.stringify({
        Email: false,
        Slack: false,
        InApp: false,
      });

    if (!changesMade) {
      setSettingsFeedback('No changes were made.');
      return;
    }

    if (
      !alertPreferences.Email &&
      !alertPreferences.Slack &&
      !alertPreferences.InApp
    ) {
      setSettingsFeedback('Select at least one alert preference.');
      return;
    }

    if (!password.trim()) {
      setSettingsFeedback('Enter the password to save preferences.');
      return;
    }

    // If email required, extract the email address from the field. Otherwise, preferredEmail will be empty
    const preferredEmail = isEmailRequired
      ? document.getElementById('emailAddress').value
      : '';

    // If slack URL required, extract the slack URL from the field. Otherwise, slackURL will be empty
    const slackURL = isSlackURLRequired
      ? document.getElementById('slack').value
      : '';

    // Put request to update the preferences in db
    try {
      const response = await fetch(`${apiUrl}/alert/update-preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: userInfo.userID,
          preferences: alertPreferences,
          preferredEmail: preferredEmail,
          slackURL: slackURL,
        }),
      });

      // If successful, then update the saved preferences and feedback message on the front end
      if (response.ok) {
        console.log('Alert preferences saved successfully.');
        setSavedPreferences(alertPreferences);
        setSettingsFeedback('Alert preferences saved successfully.');
      }
    } catch (error) {
      console.error('Error while saving alert preferences:', error);
      setSettingsFeedback('Failed to save alert preferences.');
    }
  };

  return (
    <Container sx={containerStyle}>
      <Grid container spacing={2}>
        <Grid item xs={5} md={4}>
          <Paper elevation={1} style={{ padding: '15px', marginBottom: '10px' }}>
            <Typography variant="h6" paddingBottom={'10px'}>Current Preferences:</Typography>
            <List>
              {Object.entries(savedPreferences).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText primary={`${key}: ${value ? 'Yes' : 'No'}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={8} md={5}>
          <Paper elevation={1} style={{ padding: '15px', marginBottom: '10px' }}>
            <Typography variant="h4" paddingBottom={'10px'}>Alert Preferences</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={alertPreferences['Email']}
                        onChange={() => handleAlertChange('Email')}
                      />
                    }
                    label={`Receive Email Alerts`}
                  />
                  {alertPreferences['Email'] && (
                    <TextField
                      id="emailAddress"
                      label="Enter email for email alerts"
                      variant="outlined"
                      margin="normal"
                      name="emailAddress"
                      sx={{ width: '100%' }}
                      required={isEmailRequired}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={alertPreferences['Slack']}
                        onChange={() => handleAlertChange('Slack')}
                      />
                    }
                    label={`Receive Slack Alerts`}
                  />
                  {alertPreferences['Slack'] && (
                    <TextField
                      id="slack"
                      label="Enter Slack API URL for notifications"
                      variant="outlined"
                      margin="normal"
                      name="slackURL"
                      sx={{ width: '100%' }}
                      required={isSlackURLRequired}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={alertPreferences['InApp']}
                        onChange={() => handleAlertChange('InApp')}
                      />
                    }
                    label={`Receive In App Alerts`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    margin="normal"
                    sx={{ width: '50%' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="outlined" sx={{ width: '75%' }}>
                    Save Preferences
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {/* condiitonal rendering of feedback message*/}
                  {settingsFeedback ? (
                    <Typography
                      variant="body2"
                      color={
                        settingsFeedback.includes('success') ? 'success' : 'error'
                      }
                    >
                      {settingsFeedback}
                    </Typography>
                  ) : null}
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AlertSettings;
