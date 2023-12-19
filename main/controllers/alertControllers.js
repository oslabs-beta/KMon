const path = require('path');
const fs = require('fs').promises; // Use fs.promises for asynchronous file operations
const ini = require('ini');

const alertControllers = {};

alertControllers.writeAlertsInfo = async (req, res, next) => {
  try {
    const destination = path.join(__dirname, '../../grafana/grafana.ini');

    const { emailAddress, appPassword } = req.body;
    console.log('alerts controller emailAddress, appPassword accepted!', 'entered email =>', emailAddress, 'enter appPassword =>', appPassword);

    // Read grafana.ini file
    const configFile = await fs.readFile(destination, 'utf-8');
    const config = ini.parse(configFile);

    // Update grafana.ini file
    config['smtp'] = config['smtp'] || {};
    config['smtp']['user'] = emailAddress;
    config['smtp']['password'] = appPassword;
    config['smtp']['from_address'] = emailAddress;

    // Write to grafana.ini file
    await fs.writeFile(destination, ini.stringify(config));

    return next();
  } catch (err) {
    console.error('Error in alertsController:', err);
    return next({ message: 'Error in alertsController', error: err });
  }
};

module.exports = alertControllers;
