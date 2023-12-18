const express = require('express');
const router = express.Router();
const configController = require('../controllers/configControllers');


router.post('/createConnection', configController.getPrometheusPorts, configController.createConnection, (req, res, next) => {
  try {
    res.status(200);
    return next();
  }
  catch {
    (err) => {
      // console
    }
  }
})


module.exports = router;