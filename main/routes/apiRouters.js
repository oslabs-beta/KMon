const express = require('express');
const router = express.Router();
const configControllers = require('../controllers/configControllers');
const dbControllers = require('../controllers/dbControllers');


router.post('/createConnection', configControllers.getKafkaBrokers, configControllers.getPrometheusPorts, configControllers.updateGrafana, configControllers.updateDocker, dbControllers.saveConnection, (req, res, next) => {

  const { brokers } = res.locals;
  res.status(200).json(brokers);

});

router.get('/getConnections/:userid', dbControllers.getConnections, (req, res) => {

  const data = res.locals.data;
  res.status(200).send(JSON.stringify(data));

});

router.delete('/deleteConnections', dbControllers.deleteConnections, configControllers.deleteConnections, (req, res) => {

  const { dbResponse, configResponse } = res.locals.response;
  res.status(200).send(JSON.stringify(dbResponse, configResponse));

});

module.exports = router;
