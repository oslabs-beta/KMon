const express = require('express');
const router = express.Router();
const configController = require('../controllers/configControllers');
const dbController = require('../controllers/dbController');


router.post('/createConnection', configController.getPrometheusPorts, configController.createGrafanaYaml, configController.updateDocker, dbController.saveConnection, (req, res) => {

  res.status(200).send(JSON.stringify('Connection created!'))

})

router.get('/getConnections/:userid', dbController.getConnections, (req, res) => {

  const data = res.locals.data;
  res.status(200).send(JSON.stringify(data));

})

router.delete('/deleteConnections', dbController.deleteConnections, configController.deleteConnections, (req, res) => {

  const { dbResponse, configResponse } = res.locals.response;
  res.status(200).send(JSON.stringify(dbResponse, configResponse));

})

module.exports = router;
