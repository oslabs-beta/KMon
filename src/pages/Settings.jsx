import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../AppContext.js';

// TO DO: confirm apiUrl for production
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
  const [alertPreferences, setAlertPreferences] = useState({
    Email: false,
    Slack: false,
    InApp: false,
  });
  const [settingsFeedback, setSettingsFeedback] = useState(null);
  const isSlackURLRequired = alertPreferences['Slack'];
  const isEmailRequired = alertPreferences['Email'];

  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleAlertChange = (type) => {
    // Check if the user has changed the checkbox state
    if (
      !existingPreferences ||
      alertPreferences[type] !== existingPreferences[type]
    ) {
      setAlertPreferences((prev) => ({ ...prev, [type]: !prev[type] }));
    }
  };

  const { userInfo, updateUserInfo } = useAppContext();

  // TO DO: set existing preferences so user sees their previous selections
  const [existingPreferences, setExistingPreferences] = useState({});

  // Ensure valid submission and handle saving using POST API call
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if any changes were made by comparing with existing preferences
    const changesMade =
      JSON.stringify(alertPreferences) !== JSON.stringify(existingPreferences);

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
      setSettingsFeedback('Enter password to save preferences.');
      return;
    }

    const preferredEmail = isEmailRequired
      ? document.getElementById('emailAddress').value
      : '';

    const slackURL = isSlackURLRequired
      ? document.getElementById('slack').value
      : '';

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

      if (response.ok) {
        console.log('Alert preferences saved successfully.');
        setSettingsFeedback('Alert preferences saved successfully.');
      }
    } catch (error) {
      console.error('Error while saving alert preferences:', error);
      setSettingsFeedback('Failed to save alert preferences.');
    }
  };

  return (
    <Container sx={containerStyle}>
      <div style={{ textAlign: 'left' }}>
        <div
          style={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            margin: '30px 0',
          }}
        >
          <Typography variant="h5">Alert Preferences</Typography>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                margin: '5px 0',
              }}
            >
              <FormControlLabel
                key="Email"
                control={
                  <Checkbox
                    // checked={alertPreferences['Email']}
                    checked={
                      existingPreferences ? existingPreferences['Email'] : false
                    }
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
                  sx={{ width: '400px' }}
                  required={isEmailRequired}
                />
              )}

              <FormControlLabel
                key="Slack"
                control={
                  <Checkbox
                    // checked={alertPreferences['Slack']}
                    checked={
                      existingPreferences ? existingPreferences['Slack'] : false
                    }
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
                  sx={{ width: '400px' }}
                  required={isSlackURLRequired}
                />
              )}
              <FormControlLabel
                key="InApp"
                control={
                  <Checkbox
                    checked={alertPreferences['InApp']}
                    onChange={() => handleAlertChange('InApp')}
                  />
                }
                label={`Receive In App Alerts`}
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                margin: '5px 0',
              }}
            >
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                margin="normal"
                sx={{ width: '300px' }}
              />

              <Button type="submit" variant="outlined" sx={{ width: '200px' }}>
                Save Preferences
              </Button>

              {/* Conditional rendering of feedback */}
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
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default AlertSettings;
