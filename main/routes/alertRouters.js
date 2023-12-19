const express = require('express');
const alertController = require('../controllers/alertController');

const router = express.Router();

router.post('/alertsInfo', alertController.writeAlertsInfo, (req, res) => {
    res.status(200);
})

module.exports = router;