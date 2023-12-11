const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

router.post('/signup', authControllers.signup, (req, res) => {
  res.status(200).json(res.locals.userId);
});

router.post('/login', authControllers.login, (req, res) => {
  res.status(200).json(res.locals.userId);
});

router.get('/logout', authControllers.logout, (req, res) => {
  res.status(200);
});

module.exports = router;
