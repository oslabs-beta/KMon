const Store = require('electron-store');
const fs = require('fs');
const path = require('path');

// external JS libraries for writing Kafka scripts and for writing YAML files
const kafka = require('kafkajs');
const yaml = require('js-yaml');
const { default: cluster } = require('cluster');


const configController = {};



configController.getPrometheusPorts = (req, res, next) => {
  // console.log('configController.createConnection - req.body: ', req.body);

  try {
    const dockerCompose = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../docker-compose.yml'), 'utf-8'))

    const prometheusPorts = {
      promCount: 0
    };

    // check how many Prometheus instances are running. Get the port numbers and the number of Prometheus instances.
    for (let key in dockerCompose.services) {
      // check if the key contains the string 'prometheus.' If so, grab the external port 
      if (key.toLowerCase().includes('prometheus')) {
        const outerPort = dockerCompose.services[key].ports[0].replace(/\:\d*/, '')
        const innerPort = dockerCompose.services[key].ports[0].replace(/\d*\:/, '')
        prometheusPorts[key] = [outerPort, innerPort]
        prometheusPorts.promCount++;
      }
    }
    // console.log('prometheusNum: ', prometheusNum);
    // console.log('prometheusPorts: ', prometheusPorts);
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


configController.createConnection = (req, res, next) => {


  // destructure ip and the port numbers from req.body and put this into the scrape-targets configuration
  // and the "cluster name" will be taken as the job name.
  try {
    const { clusterName, serverURI, ports } = req.data;
    const prometheusPorts = req.locals.prometheusPorts;

    console.log(prometheusPorts);


    const newDockerCompose = {
      version: '3.8',
      services: {
        prometheus: {
          image: 'prom/prometheus:latest',
          volumes: [
            './prometheus.yml:/etc/prometheus/prometheus.yml:ro',
            'prometheus_data:/prometheus'
          ],
          ports: ['9090:9090']
        },
        grafana: {
          image: 'grafana/grafana:latest',
          volumes: [
            './grafana/provisioning/dashboards:/etc/grafana/provisioning/dashboards',
            './grafana/provisioning/datasources:/etc/grafana/provisioning/datasources',
            './grafana/dashboards:/var/lib/grafana/dashboards',
            './grafana/grafana.ini:/etc/grafana/grafana.ini'
          ],
          environment: {
            GF_SECURITY_ADMIN_PASSWORD: 'codesmith',
            GF_AUTH_ANONYMOUS_ENABLED: 'true',
            GF_PATHS_CONFIG: '/etc/grafana/grafana.ini'
          },
          ports: ['3000:3000'],
          depends_on: ['prometheus']
        }
      },
      volumes: { prometheus_data: null, grafana_data: null }
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

    // console.log(newConfig.scrape_configs[0].static_configs);
    // create new Yaml config, write it to a new file
    const newPromYml = yaml.dump(newPromConfig);
    // fs.writeFileSync(`./prometheus${prometheusNum}.yml`, newPromYml, 'utf-8')

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