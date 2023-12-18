const Store = require('electron-store');
const fs = require('fs');
const path = require('path');

// external JS libraries for writing Kafka scripts and for writing YAML files
const kafka = require('kafkajs');
const yaml = require('js-yaml');
const { default: cluster } = require('cluster');


const configController = {};

configController.createConnection = (req, res, next) => {
  console.log('configController.createConnection - req.body: ', req.body);
  // OKAY!
  // need to write a yaml file. 
  // we'll destructure ip and the port numbers from req.body and put this into the scrape-targets configuration
  // and the "cluster name" will be taken as the job name.
  // and we'll fs.writeFileSync or whichever node method to append this to the end of our prometheus.yml file.
  try {
    const { clusterName, serverURI, ports } = req.body;
    console.log('request body values: ', clusterName, serverURI, ports)
    console.log(path.resolve('../Kmon', 'prometheus.yml'))

    const doc = yaml.load(fs.readFileSync(path.resolve('../Kmon', 'prometheus.yml'), 'utf-8'))
    console.log(doc);
    const newConfig = {
      scrape_configs: [
        {
          job_name: clusterName,
          static_configs: ports.map((port) => {
            return `${serverURI}:${port}`
          })
        }
      ]
    }

    const newDoc = yaml.dump(fs.writeFileSync())



  }
  catch {
    const error = {
      log: 'Error occurred in configControllers.createConnection middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to create connection' }
    }
    return next(error);
  }

}



module.exports = configController