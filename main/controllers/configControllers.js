const Store = require('electron-store');
const fs = require('fs');
const path = require('path');
const { exec } = require('node:child_process');

// external JS libraries for writing Kafka scripts and for writing YAML files
const kafka = require('kafkajs');
const yaml = require('js-yaml');

const { default: cluster } = require('cluster');

const configController = {};

configController.getPrometheusPorts = (req, res, next) => {
  // console.log('configController.createConnection - req.body: ', req.body);
  try {
    const dockerCompose = yaml.load(
      fs.readFileSync(
        path.resolve(__dirname, '../../docker-compose.yml'),
        'utf-8'
      )
    );
    const prometheusPorts = {
      promCount: 0,
      maxPort: 0,
    };
    // check how many Prometheus instances are running. Get the port numbers and the number of Prometheus instances.
    for (let key in dockerCompose.services) {
      // check if the key contains the string 'prometheus.' If so, grab the ports and add them to the property in an array.
      if (key.toLowerCase().includes('prometheus')) {
        const outerPort = dockerCompose.services[key].ports[0].replace(
          /\:\d*/,
          ''
        );
        const innerPort = dockerCompose.services[key].ports[0].replace(
          /\d*\:/,
          ''
        );

        if (Number(outerPort) > prometheusPorts.maxPort) {
          prometheusPorts.maxPort = outerPort;
        }
        prometheusPorts[key] = [outerPort, innerPort];
        prometheusPorts.promCount++;
      }
    }

    res.locals.prometheusPorts = prometheusPorts;
    // console.log('got prometheus ports: ', res.locals.prometheusPorts)

    return next();
  } catch {
    const error = {
      log: 'Error occurred in configControllers.getPrometheusPorts middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to identify ports' },
    };
    return next(error);
  }
};

configController.createGrafanaYaml = (req, res, next) => {
  try {
    const { id } = req.body;
    const prometheusNum = res.locals.prometheusPorts.promCount;
    const maxPort = res.locals.prometheusPorts.maxPort

    const dashboardsDoc = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../grafana/provisioning/dashboards/dashboard.yml'), 'utf-8'))
    const datasourcesDoc = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../grafana/provisioning/datasources/datasource.yml'), 'utf-8'))

    // create new dataProvider and dataSource objects to append to yml files.
    const newDataProvider = {
      name: `prometheus${id}`,
      orgId: 1,
      folder: '',
      type: 'file',
      disableDeletion: false,
      editable: false,
      allowUiUpdates: true,
      options: {
        path: '/etc/grafana/provisioning/dashboards'
      }
    }

    const newDatasource = {
      name: `prometheus${id}`,
      type: 'prometheus',
      access: 'proxy',
      orgId: 1,
      url: `http://prometheus${id}:9090`,
      basicAuth: false,
      isDefault: false,
      editable: true
    }
    // if the providers/datasources libraries are empty, add it. If there's an entry already, push.

    if (!dashboardsDoc.providers) {
      dashboardsDoc.providers = [newDataProvider];
    } else {
      dashboardsDoc.providers.push(newDataProvider);
    }

    if (!datasourcesDoc.datasources) {
      datasourcesDoc.datasources = [newDatasource];
    } else {
      datasourcesDoc.datasources.push(newDatasource);
    };

    const newDashboardYaml = yaml.dump(dashboardsDoc, {
      indent: 2,
      noArrayIndent: true
    });
    const newDatasourcesYaml = yaml.dump(datasourcesDoc, {
      indent: 2,
      noArrayIndent: true
    })

    fs.writeFileSync(path.resolve(__dirname, '../../grafana/provisioning/dashboards/dashboard.yml'), newDashboardYaml, 'utf-8')
    fs.writeFileSync(path.resolve(__dirname, '../../grafana/provisioning/datasources/datasource.yml'), newDatasourcesYaml, 'utf-8')

    return next();
  } catch {
    const error = {
      log: 'Error occurred in configControllers.createGrafanaYaml middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to create connection' },
    };
    return next(error);
  }
};

configController.createConnection = (req, res, next) => {
  try {
    // destructure ip and the port numbers from req.body and put this into the scrape-targets configuration
    // and the "cluster name" will be taken as the job name.
    const { clusterName, serverURI, ports, id } = req.body;
    const { promCount, maxPort } = res.locals.prometheusPorts;

    console.log('about to start composing docker-compose and prometheus yml files')
    // load dockerCompose file from YAML and add new prometheus port to services
    const dockerCompose = yaml.load(
      fs.readFileSync(
        path.resolve(__dirname, '../../docker-compose.yml'),
        'utf-8'
      )
    );

    // update docker compose services by adding new prometheus to grafana dependencies and adding entry to services.
    console.log('checking if grafana has depends on dictionary...')
    console.log((!dockerCompose.services.grafana.depends_on))
    if (!dockerCompose.services.grafana.depends_on) {
      dockerCompose.services.grafana.depends_on = [`prometheus${id}`]
    } else {
      dockerCompose.services.grafana.depends_on.push(`prometheus${id}`);
    };

    console.log('adding prometheus to services...')
    dockerCompose.services[`prometheus${id}`] = {
      image: 'prom/prometheus:latest',
      volumes: [
        `./prometheus${id}.yml:/etc/prometheus/prometheus.yml:ro`,
        `prometheus_data:/prometheus${id}`,
        './kafka_controller_alerts.yml:/etc/prometheus/kafka_controller_alerts.yml'
      ],
      ports: [`${maxPort === 0 ? 9090 : Number(maxPort) + 1}:9090`]
    };

    // define new Prometheus config file
    // config MUST return strings for ports.
    const newPromConfig = {
      global: { scrape_interval: '15s' },
      alerting: {
        alertmanagers: [{
          static_configs: [
            { targets: ['localhost:9093'] }
          ]
        }]
      },
      rule_files: ['/etc/prometheus/rules/*.yml'],
      scrape_configs: [
        {
          job_name: clusterName,
          static_configs: [
            {
              targets: ports.map((port) => {
                return `${serverURI}:${port}`;
              }),
            },
          ],
        },
      ],
    };

    // parse JS objects back to YAML
    const newPromYml = yaml.dump(newPromConfig, {
      indent: 2,
      noArrayIndent: true,
    });
    const newDockerYml = yaml.dump(dockerCompose, {
      indent: 2,
      noArrayIndent: true,
    });

    // write new files to directory
    fs.writeFileSync(path.resolve(__dirname, '../../docker-compose.yml'), newDockerYml, 'utf-8')
    fs.writeFileSync(path.resolve(__dirname, `../../prometheus${id}.yml`), newPromYml, 'utf-8')

    // compose any new containers (for prometheus instances). Remove anything that's been deleted.
    exec('docker compose up -d --remove-orphans', (err, stdout, stderr) => {
      if (err) {
        return next({
          log: 'Error while restarting Docker container',
          status: 500,
          message: { error: 'Internal server error' },
        })
      }
    })
    return next();

  } catch {
    const error = {
      log: 'Error occurred in configControllers.createConnection middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to create connection' },
    };
    return next(error);
  }
};

configController.deleteConnections = (req, res, next) => {
  try {
    const { userid, clusters } = req.body;

    const dashboardsDoc = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../grafana/provisioning/dashboards/dashboard.yml'), 'utf-8'))
    const datasourcesDoc = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../grafana/provisioning/datasources/datasource.yml'), 'utf-8'))
    const dockerCompose = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../docker-compose.yml'), 'utf-8'));

    // dashboardDoc datasources is an array of objects.
    // so we should iterate through dashboardsDoc.datasources
    // and for each object, we will check the name.
    // if the name matches "prometheus{clusters[i]}," we'll remove that property from the datasources array.





    // we'll have to do the same for the dashboardsDoc.providers array.

    // for dockerCompose, we'll have to do this process for the depends_on array, making sure to delete the property entirely if the array is empty after deletion.
    // and we'll have to go through the services dictionary and delete each object that has the format of prometheus${cluster[i]}.


  }
  catch {

  }
}

module.exports = configController;
