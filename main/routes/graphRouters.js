const express = require('express');
const router = express.Router();
const graphControllers = require('../controllers/graphControllers');

router.post('/graph', 
graphControllers.createGraph, 
(req, res) => {
    res.status(201).json({/* add here*/});
  }
)

router.get()

module.exports = router;