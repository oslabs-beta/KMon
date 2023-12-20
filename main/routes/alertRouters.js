const express = require('express');
const router = express.Router();
const alertControllers = require('../controllers/alertControllers');

// Need to refactor routers to send success/error messages from the server, not the middleware
router.put(
  '/update-preferences',
  alertControllers.updatePreferences,
  (req, res) => {
    res.status(200).json({ message: 'Update successful' });
  }
);

router.get(
  '/get-preferences/:userID',
  alertControllers.sendPreferences,
  (req, res) => {
    res.status(200);
  }
);

// For receiving alerts from Alertmanager
router.post('/receive-alert', alertControllers.receiveAlert, (req, res) => {
  res
    .status(200)
    .json({ success: true, message: 'Alert received successfully.' });
});

module.exports = router;
