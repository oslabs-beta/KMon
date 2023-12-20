const express = require('express');
const alertControllers = require('../controllers/alertControllers');

const router = express.Router();

router.post('/alertsInfo', alertControllers.writeAlertsInfo, (req, res) => {
    res.status(200);
})

module.exports = router;