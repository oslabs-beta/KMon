const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

router.post(
  '/signup',
  authControllers.createUser,
  authControllers.setSessionCookie,
  (req, res) => {
    const user = res.locals.user;
    res.status(201).json({ message: 'Signup successful', user });
  }
);

router.post(
  '/login',
  authControllers.verifyUser,
  authControllers.setSessionCookie,
  (req, res) => {
    const user = res.locals.user;
    res.status(201).json({ message: 'Login successful', user });
  }
);

router.post(
  '/logout',
  authControllers.clearSessionCookie,
  (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
  }
);

module.exports = router;