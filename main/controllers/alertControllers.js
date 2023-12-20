const db = require('../models/db');
const dotenv = require('dotenv');

// alert preferences is a JSON object in the database 
// default value is '{"Email": false, "Slack": false, "InApp": false}';
const alertControllers = {};

// The user ID should be provided in the request params or body
alertControllers.updatePreferences = async (req, res, next) => {
  try {
    const { userID, preferences, preferredEmail, slackURL } = req.body;
    console.log(userID, preferences);

    // Validate user ID and preferences
    if (!userID || !preferences) {
      return res.status(400).json({ error: 'Invalid request.' });
    }

    // Update the alert preferences for the user in the database
    const updateQuery = `
      UPDATE users
      SET alert_preferences = $1
      WHERE user_id = $2;
    `;

    const result = await db.query(updateQuery, [preferences, userID]);
    console.log(result);

    if (result.rowCount === 1) {
      // Successfully updated the alert preferences
      res.status(200).json({ success: true, message: 'Alert preferences updated successfully.' });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    console.error('Error updating alert preferences:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = alertControllers;
