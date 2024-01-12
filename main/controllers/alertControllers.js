const db = require('../models/db');
const dotenv = require('dotenv');

// Alert preferences is a JSON object in the database; Default value for alert_preferences is '{"Email": false, "Slack": false, "InApp": false}'
// Also have columns for preferred_email and slack_url

const alertControllers = {};

alertControllers.updatePreferences = async (req, res, next) => {
  try {
    const { userID, preferences, preferredEmail, slackURL } = req.body;
    // console.log(userID, preferences);

    // Validate user ID and preferences
    if (!userID || !preferences) {
      return res.status(400).json({ error: 'Invalid request.' });
    }

    // Update the alert preferences and related fields for the user in the database
    const updateQuery = `
      UPDATE users
      SET 
        alert_preferences = $1,
        preferred_email = $2,
        slack_url = $3
      WHERE user_id = $4;
    `;

    const result = await db.query(updateQuery, [
      preferences,
      preferredEmail,
      slackURL,
      userID,
    ]);
    // console.log(result);

    if (result.rowCount === 1) {
      // Successfully updated the alert preferences
      res.status(200).json({
        success: true,
        message: 'Alert preferences updated successfully.',
      });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    return next({
      log: 'Error in alertControllers.updatePreferences',
      status: 500,
      message: { error: 'Internal server error' },
    });
  }
};

alertControllers.fetchPreferences = async (req, res, next) => {
  try {
    const { userID } = req.params; // Get the userID from the URL parameters

    // Validate user ID
    if (!userID) {
      return res.status(400).json({ error: 'Invalid request.' });
    }

    // Fetch the alert preferences for the user from the database
    const selectQuery = `
      SELECT alert_preferences, preferred_email, slack_url
      FROM users
      WHERE user_id = $1;
    `;

    const result = await db.query(selectQuery, [userID]);

    if (result.rows.length === 1) {
      const { alert_preferences, preferred_email, slack_url } = result.rows[0];
      const preferencesData = {
        preferences: alert_preferences,
        preferredEmail: preferred_email,
        slackURL: slack_url,
      };

      // Successfully retrieved the alert preferences
      res.status(200).json({ success: true, data: preferencesData });
    } else {
      // User not found
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    return next({
      log: 'Error in alertControllers.sendPreferences',
      status: 500,
      message: { error: 'Internal server error' },
    });
  }
};

// TO DO: Store or process the alert from Alertmanager
// alertControllers.receiveAlert = (req, res, next) => {
//   const alert = req.body;
//   console.log('Received alert:', alert);
//   res.status(200).send('Alert received successfully.');
// };

module.exports = alertControllers;
