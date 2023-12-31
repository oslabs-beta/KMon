const express = require('express');
const router = express.Router();
const configControllers = require('../controllers/configControllers');
const dbControllers = require('../controllers/dbControllers');


router.post('/createConnection', configControllers.getPrometheusPorts, configControllers.updateGrafana, configControllers.updateDocker, dbControllers.saveConnection, (req, res) => {

  res.status(200).send(JSON.stringify('Connection created!'))

})

router.get('/getConnections/:userid', dbControllers.getConnections, (req, res) => {

  const data = res.locals.data;
  res.status(200).send(JSON.stringify(data));

})

router.delete('/deleteConnections', dbControllers.deleteConnections, configControllers.deleteConnections, (req, res) => {

  const { dbResponse, configResponse } = res.locals.response;
  res.status(200).send(JSON.stringify(dbResponse, configResponse));

})

module.exports = router;
