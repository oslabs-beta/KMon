const express = require('express');
const router = express.Router();
const alertControllers = require('../controllers/alertControllers');

router.post(
  '/getUserInfo',
  alertControllers.findUser,
  (req, res) => {
    res.status(201);
  }
);

module.exports = router;