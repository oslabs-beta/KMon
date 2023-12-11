const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

router.post(
  '/signup',
  authControllers.createUser,
  authControllers.setSessionCookie,
  (req, res) => {
    res.status(201).json(res.locals.user);
  }
);

router.post(
  '/login',
  authControllers.verifyUser,
  authControllers.setSessionCookie,
  (req, res) => {
    res.status(201).json(res.locals.user);
  }
);

router.get(
  '/logout',
  authControllers.verifySessionCookie,
  authControllers.clearSessionCookie,
  (req, res) => {
    res.status(200);
  }
);

module.exports = router;
