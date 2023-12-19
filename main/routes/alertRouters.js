const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/alertControllers');

// Need to refactor routers to send success/error messages from the server, not the middleware
router.post(
  '/alert-preferences',
  (req, res) => {
  }
);



module.exports = router;