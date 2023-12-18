import React, { useState, useEffect } from 'react';
import { Button, Container, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AlertSettings = () => {
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [alertPreferences, setAlertPreferences] = useState({ Email: false, Slack: false, inApp: false });
  const [emailSettings, setEmailSettings] = useState({ recipientEmails: [''] });

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleAlertChange = (type) => setAlertPreferences((prev) => ({ ...prev, [type]: !prev[type] }));

  const saveAlertPreferences = async () => {
    try {
      const response = await fetch('/api/save-alert-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertPreferences),
      });

      if (response.ok) {
        console.log('Alert preferences saved successfully.');
      } else {
        console.error('Failed to save alert preferences:', response.statusText);
      }
    } catch (error) {
      console.error('Error while saving alert preferences:', error);
    }
  };

  const handleEmailInputChange = (index, value) => {
    setEmailSettings((prev) => {
      const updatedRecipients = [...prev.recipientEmails];
      updatedRecipients[index] = value;
      return { ...prev, recipientEmails: updatedRecipients };
    });
  };

  const addEmailField = () => setEmailSettings((prev) => (
    { ...prev, recipientEmails: [...prev.recipientEmails, ''] }
  ));

  const removeEmailField = (index) => setEmailSettings((prev) => {
    const updatedRecipients = [...prev.recipientEmails];
    updatedRecipients.splice(index, 1);
    return { ...prev, recipientEmails: updatedRecipients };
  });

  const handleEmailSettingsSubmit = (event) => {
    event.preventDefault();
    console.log('Email settings saved:', emailSettings);
  };

  const getUserEmail = async () => {
    try {
      const response = await fetch('/api/save-alert-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertPreferences),
      });

      if (response.ok) {
        console.log('Alert preferences saved successfully.');
      } else {
        console.error('Failed to save alert preferences:', response.statusText);
      }
    } catch (error) {
      console.error('Error while saving alert preferences:', error);
    }
  }

  useEffect(() => addEmailField(), []); // Only runs once and adds email field when the component mounts

  return (
    <Container sx={containerStyle}>
      <div style={{ textAlign: 'left' }}>
        <Typography variant="h5">Email Settings</Typography>
        <form onSubmit={handleEmailSettingsSubmit}>
          {emailSettings.recipientEmails.map((recipient, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginLeft: '0' }}>
              <TextField
                label={`Recipient ${index + 1}`}
                type="text"
                value={recipient}
                onChange={(e) => handleEmailInputChange(index, e.target.value)}
                margin="normal"
                sx={{ width: '300px' }}
              />
              {index > 0 && (
                <Button type="button" onClick={() => removeEmailField(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Typography>Recipients: {emailSettings.recipientEmails}</Typography>
          <Button type="button" variant="outlined" onClick={addEmailField}>
            Add Email
          </Button>
          <Button type="submit" variant="outlined">
            Save Settings
          </Button>
        </form>

        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'left', margin: '30px 0' }}>
          <Typography variant="h5">Alert Preferences</Typography>
          <form>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '5px 0' }}>
              {['Email', 'Slack', 'inApp'].map((type) => (
                <FormControlLabel
                  key={type}
                  control={<Checkbox checked={alertPreferences[type]} onChange={() => handleAlertChange(type)} />}
                  label={`Receive ${type === 'inApp' ? 'In App' : type} Alerts`}
                />
              ))}
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
                variant="outlined"
                onClick={saveAlertPreferences}
                sx={{ width: '200px' }}
              >
                Save Preferences
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default AlertSettings;
