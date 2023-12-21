const express = require('express');
const router = express.Router();
const alertControllers = require('../controllers/alertControllers');
const authControllers = require('../controllers/authControllers');

// Need to refactor routers to send success/error messages from the server, not the middleware
router.put(
  '/update-preferences', authControllers.verifyUser,
  alertControllers.updatePreferences,
  (req, res) => {
    res.status(200).json({ message: 'Update successful' });
  }
);

router.get(
  '/get-preferences/:userID',
  alertControllers.fetchPreferences,
  (req, res) => {
    res.status(200);
  }
);

// TO DO: For receiving alerts from Alertmanager
// router.post('/receive-alert', alertControllers.receiveAlert, (req, res) => {
//   res
//     .status(200)
//     .json({ success: true, message: 'Alert received successfully.' });
// });

module.exports = router;
