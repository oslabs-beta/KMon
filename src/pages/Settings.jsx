import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../AppContext.js';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.kmon.com'
    : 'http://localhost:3010';

const MAX_EMAIL_LENGTH = 255;
const MAX_SLACK_URL_LENGTH = 100;

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
  const [emailAddress, setEmailAddress] = useState('');
  const [slackURL, setSlackURL] = useState('');

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
  const { userInfo } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/alert/get-preferences/${userInfo.userID}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.ok) {
          const preferencesData = await response.json();
          setSavedPreferences(preferencesData.data.preferences);
          // Initialize alertPreferences based on savedPreferences after fetching
          setAlertPreferences({
            Email: preferencesData.data.preferences.Email || false,
            Slack: preferencesData.data.preferences.Slack || false,
            InApp: preferencesData.data.preferences.InApp || false,
          });
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

    if (!password.trim()) {
      setSettingsFeedback('Enter the password to save preferences.');
      return;
    }

    // Check to see if any changes were made before API call
    if (
      alertPreferences.Email === savedPreferences.Email &&
      alertPreferences.Slack === savedPreferences.Slack &&
      alertPreferences.InApp === savedPreferences.InApp
    ) {
      setSettingsFeedback(
        'Preferences are already up to date, no changes were made.'
      );
      return;
    }

    // Check to see if there are any selections before API call
    if (
      Object.keys(savedPreferences).filter((key) => savedPreferences[key]).length === 0 && 
      !alertPreferences.Email &&
      !alertPreferences.Slack &&
      !alertPreferences.InApp
    ) {
      setSettingsFeedback('Select at least one alert preference.');
      setPassword('');
      return;
    }

    // If email required, use the email address. Otherwise, preferredEmail will be empty
    // const preferredEmail = isEmailRequired
    //   ? document.getElementById('emailAddress')?.value
    //   : '';
    const preferredEmail = isEmailRequired ? emailAddress : '';

    if (isEmailRequired && preferredEmail.length > MAX_EMAIL_LENGTH) {
      setSettingsFeedback('Please enter a valid email.');
      return;
    }

    // If slack URL required, use the slack URL. Otherwise, slackURL will be empty
    // const slackURL = isSlackURLRequired
    //   ? document.getElementById('slack')?.value
    //   : '';
    const slackURL = isSlackURLRequired ? slackURL : '';

    if (isSlackURLRequired && slackURL.length > MAX_SLACK_URL_LENGTH) {
      setSettingsFeedback('Please enter a valid URL.');
      return;
    }

    // Put request to update the preferences in db
    try {
      const response = await fetch(`${apiUrl}/alert/update-preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: userInfo.userID,
          user_email: userInfo.userEmail,
          user_password: password,
          preferences: alertPreferences,
          preferredEmail: preferredEmail,
          slackURL: slackURL,
        }),
      });

      // If successful, then update the saved preferences and feedback message on the front end
      if (response.ok) {
        // console.log('Alert preferences saved successfully.');
        setSavedPreferences(alertPreferences);
        setSettingsFeedback('Alert preferences saved successfully.');
        setPassword('');
      } else {
        setSettingsFeedback('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (error) {
      console.error('Error while saving alert preferences:', error);
      // setSettingsFeedback('Failed to save alert preferences.');
      setSettingsFeedback(
        `Error while saving alert preferences: ${response.status}`
      );
      setPassword('');
    }
  };

  return (
    <Container sx={containerStyle}>
      <Grid container spacing={2}>
        <Grid item xs={8} md={5}>
          <Paper
            elevation={1}
            style={{ padding: '15px', marginBottom: '20px' }}
          >
            <Typography variant="h4" paddingBottom={'10px'}>
              Alert Preferences
            </Typography>
            <form onSubmit={handleSubmit}>
              {/* Current Preferences Section */}
              <Paper
                elevation={1}
                sx={{ padding: '15px', marginBottom: '10px' }}
              >
                <Typography variant="body1" paddingBottom={'10px'}>
                  {/* filter the keys to only include those selected */}
                  Current Preferences:{' '}
                  {Object.keys(savedPreferences)
                    .filter((key) => savedPreferences[key])
                    .map((key) => `${key} Alerts`)
                    .join(', ')}
                </Typography>
              </Paper>

              <Grid container spacing={2}>
                {/* Email Checkbox and Field */}
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
                  {alertPreferences['Email'] && !savedPreferences['Email'] && (
                    <TextField
                      id="emailAddress"
                      label="Enter email for email alerts"
                      variant="outlined"
                      margin="normal"
                      name="emailAddress"
                      sx={{ width: '100%' }}
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      required={isEmailRequired}
                      aria-labelledby="emailAddressLabel"
                    />
                  )}
                </Grid>

                {/* Slack Checkbox and Field */}
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
                  {alertPreferences['Slack'] && !savedPreferences['Slack'] && (
                    <TextField
                      id="slack"
                      label="Enter Slack API URL for notifications"
                      variant="outlined"
                      margin="normal"
                      name="slackURL"
                      sx={{ width: '100%' }}
                      value={slackURL}
                      onChange={(e) => setSlackURL(e.target.value)}
                      required={isSlackURLRequired}
                      aria-labelledby="slackURLLabel"
                    />
                  )}
                </Grid>

                {/* InApp Checkbox */}
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

                {/* Password Field */}
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

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="outlined"
                    sx={{ width: '100%' }}
                  >
                    Save Preferences
                  </Button>
                </Grid>

                {/* Feedback Message */}
                <Grid item xs={12}>
                  {/* condiitonal rendering of feedback message */}
                  {settingsFeedback ? (
                    <Typography
                      variant="body2"
                      color={
                        settingsFeedback.includes('success')
                          ? 'success'
                          : 'error'
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
