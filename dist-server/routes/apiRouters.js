"use strict";

var express = require('express');
var router = express.Router();
var configController = require('../controllers/configControllers');
router.post('/createConnection', configController.getPrometheusPorts, configController.createConnection, function (req, res, next) {
  try {
    res.status(200);
    return next();
  } catch (_unused) {
    (function (err) {
      // console
    });
  }
});
module.exports = router;