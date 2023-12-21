import React, { useState, useEffect } from 'react';
import { Button, Container, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../AppContext.js';

// TO DO: confirm apiUrl for production
const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.kmon.com'
    : 'http://localhost:3010';

const AlertSettings = () => {
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [alertPreferences, setAlertPreferences] = useState({ Email: false, Slack: false, inApp: false });
  const [emailSettings, setEmailSettings] = useState({ recipientEmails: [''] });
  const [settingsFeedback, setSettingsFeedback] = useState(null);

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleAlertChange = (type) => setAlertPreferences((prev) => ({ ...prev, [type]: !prev[type] }));

  const saveAlertPreferences = async () => {
    try {
      const response = await fetch(`${apiUrl}/alert/alert-preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertPreferences),
      });
  
      if (response.ok) {
        console.log('Alert preferences saved successfully.');
        setSettingsFeedback('Alert preferences saved successfully.');
      } else {
        console.error('Failed to save alert preferences:', response.statusText);
        setSettingsFeedback('Failed to save alert preferences.');
      }
    } catch (error) {
      console.error('Error while saving alert preferences:', error);
      setSettingsFeedback('Failed to save alert preferences.');
    }
  };  

  const addEmailField = () => setEmailSettings((prev) => (
    { ...prev, recipientEmails: [...prev.recipientEmails, ''] }
  ));
  
  const { userInfo, updateUserInfo } = useAppContext();

  return (
    <Container sx={containerStyle}>
      <div style={{ textAlign: 'left' }}>
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'left', margin: '30px 0' }}>
          <Typography variant="h5">Alert Preferences</Typography>
          <form>
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'left', margin: '5px 0' }}>
            <FormControlLabel
              key="Email"
              control={<Checkbox checked={alertPreferences['Email']} onChange={() => handleAlertChange('Email')} />}
              label={`Receive Email Alerts`}
            />
            <TextField
                id='emailAddress'
                label='Enter email for email alerts'
                variant='outlined'
                margin='normal'
                name='emailAddress'
                sx={{ width: '400px' }}
            />
            <FormControlLabel
                key="Slack"
                control={<Checkbox checked={alertPreferences['Slack']} onChange={() => handleAlertChange('Slack')} />}
                label={`Receive Slack Alerts`}
            />
            <TextField
                id='slack'
                label='Enter Slack API URL for notifications'
                variant='outlined'
                margin='normal'
                name='slackURL'
                sx={{ width: '400px' }}
            />
            <FormControlLabel
                key="InApp"
                control={<Checkbox checked={alertPreferences['InApp']} onChange={() => handleAlertChange('InApp')} />}
                label={`Receive In App Alerts`}
            />
          </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', margin: '5px 0' }}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                margin="normal"
                sx={{ width: '300px' }}
              />

              <Button
                type="button"
                variant="contained"
                onClick={saveAlertPreferences}
                sx={{ width: '200px' }}
              >
                Save Preferences
              </Button>

             {/* Conditional rendering of feedback */}
             {settingsFeedback ? (
                <Typography variant="body2" color={settingsFeedback.includes('success') ? 'success' : 'error'}>
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