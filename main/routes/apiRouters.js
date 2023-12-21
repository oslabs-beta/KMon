const express = require('express');
const router = express.Router();
const configController = require('../controllers/configControllers');
const dbController = require('../controllers/dbController');



router.post('/createConnection', configController.getPrometheusPorts, configController.createGrafanaYaml, configController.createConnection, (req, res) => {
  
  res.status(200).send(JSON.stringify('Connection created!'))
  
})

router.post('/saveConnection', dbController.saveConnection, (req, res)=> {

  const response = res.locals.response;
  res.status(200).send(JSON.stringify('Added to database!', response))

}) 

router.get('/getConnections/:userid', dbController.getConnections, (req, res)=> {

  const data = res.locals.data;
  
  res.status(200).send(JSON.stringify(data));

})

module.exports = router;