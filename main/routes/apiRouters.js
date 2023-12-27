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

module.exports = router;
