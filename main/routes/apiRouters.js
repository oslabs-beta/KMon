const express = require('express');
const router = express.Router();
const configController = require('../controllers/configControllers');

router.post(
  '/createConnection',
  configController.getPrometheusPorts,
  configController.createGrafanaYaml,
  configController.createConnection,
  (req, res, next) => {
    try {
      res.status(200).send(JSON.stringify('Connection created!'));
    } catch (error) {
      return next({
        log: 'Error in apiRouters - could not create connection',
        status: 500,
        message: { error: 'Internal server error' },
      });
    }
  }
);

module.exports = router;
