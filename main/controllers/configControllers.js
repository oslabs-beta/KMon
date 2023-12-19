const Store = require('electron-store');
const fs = require('fs');
const path = require('path');

// external JS libraries for writing Kafka scripts and for writing YAML files
const kafka = require('kafkajs');
const yaml = require('js-yaml');
// const execa = require('execa');
// import execa from ('execa')
const { default: cluster } = require('cluster');

const configController = {};

configController.getPrometheusPorts = (req, res, next) => {
  // console.log('configController.createConnection - req.body: ', req.body);
  try {

    const dockerCompose = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../docker-compose.yml'), 'utf-8'))

    const prometheusPorts = {
      promCount: 0,
      maxPort: 0
    };

    // check how many Prometheus instances are running. Get the port numbers and the number of Prometheus instances.
    for (let key in dockerCompose.services) {
      // check if the key contains the string 'prometheus.' If so, grab the external port 
      if (key.toLowerCase().includes('prometheus')) {
        const outerPort = dockerCompose.services[key].ports[0].replace(/\:\d*/, '')
        const innerPort = dockerCompose.services[key].ports[0].replace(/\d*\:/, '')

        if (Number(outerPort) > prometheusPorts.maxPort) {
          prometheusPorts.maxPort = outerPort;
        }

        prometheusPorts[key] = [outerPort, innerPort]
        prometheusPorts.promCount++;
      }
    }
    console.log(prometheusPorts);

    res.locals.prometheusPorts = prometheusPorts;
    return next();
  }
  catch {
    const error = {
      log: 'Error occurred in configControllers.getPrometheusPorts middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to identify ports' }
    }
    return next(error);
  }
}

configController.createConnection = async (req, res, next) => {
  // destructure ip and the port numbers from req.body and put this into the scrape-targets configuration
  // and the "cluster name" will be taken as the job name.
  console.log(req.body, res.locals);
  try {
    const { clusterName, serverURI, ports } = req.body;
    const prometheusPorts = res.locals.prometheusPorts;
    // console.log(req.data);
    console.log('createConnection - prometheusPorts: ', prometheusPorts);
    const prometheusNum = prometheusPorts.promCount + 1;

    // load dockerCompose file from YAML and add new prometheus port to services
    const dockerCompose = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../docker-compose.yml'), 'utf-8'))
    dockerCompose.services[`prometheus${prometheusNum}`] = {
      image: 'prom/prometheus:latest',
      volumes: [
        `./prometheus${prometheusNum}.yml:/etc/prometheus/prometheus${prometheusNum}.yml:ro`,
        `prometheus_data:/prometheus${prometheusNum}`
      ],
      ports: [`${Number(prometheusPorts.maxPort) + 1}:9090`]
    }

    const newPromConfig = {
      global: { scrape_interval: '15s' },
      alerting: {
        alertmanagers: [{
        }]
      },
      rule_files: ['/etc/prometheus/rules/*.yaml'],
      scrape_configs: [
        {
          job_name: clusterName,
          static_configs: ports.map((port) => {
            return `${serverURI}:${port}`
          })
        }
      ]
    }

    // parse objects back to YAML
    const newPromYml = yaml.dump(newPromConfig);
    const newDockerYml = yaml.dump(dockerCompose);

    // write new files to directory
    fs.writeFileSync(path.resolve(__dirname, '../../docker-compose.yml'), newDockerYml, 'utf-8')
    fs.writeFileSync(`./prometheus${prometheusNum}.yml`, newPromYml, 'utf-8')

    execa.execaCommand('docker-compose up -d')
      .then((response) => {
        console.log(response)
      }).catch((error) => {
        console.error(error)
      })
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