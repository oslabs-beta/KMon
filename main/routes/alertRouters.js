const express = require('express');
const router = express.Router();
const alertControllers = require('../controllers/alertControllers');

// Need to refactor routers to send success/error messages from the server, not the middleware
router.put('/update-preferences', 
  alertControllers.updatePreferences, 
  (req, res) => {
  res.status(200).json({ message: 'Update successful' });
});

module.exports = router;