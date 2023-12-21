const Store = require('electron-store');
const fs = require('fs');
const path = require('path');
const { exec } = require('node:child_process');

// external JS libraries for writing Kafka scripts and for writing YAML files
const kafka = require('kafkajs');
const yaml = require('js-yaml');

const { default: cluster } = require('cluster');

const configController = {};

configController.switchDashboard = (req, res, next) => {
  try {
    const { dataswitch } = req.body;
    console.log(
      path.join(
        __dirname,
        '../../grafana/provisioning/dashboards/dashboard.json'
      )
    );
    fs.readFile(
      path.join(
        __dirname,
        '../../grafana/provisioning/dashboards/dashboard.json'
      ),
      'utf8',
      (err, data) => {
        if (err) {
          console.error(err, 'ERROR READING FILE');
          return;
        }

        const dashboard = JSON.parse(data);

        // Get datasource UID from chosen storage mechanism
        const datasourceUid = 'Prometheus3'; // Replace with your logic

        dashboard.panels[0].datasource.uid = datasourceUid;

        fs.writeFile(
          path.join(
            __dirname,
            '../../grafana/provisioning/dashboards/dashboard.json'
          ),
          JSON.stringify(dashboard, null, 4),
          (err) => {
            if (err) {
              console.log('past read file, error in write file');
              console.error(err);
            } else {
              console.log('Dashboard.json updated successfully');
            }
          }
        );
      }
    );
    return next();
  } catch (err) {
    next(err);
  }
};

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
    console.log('INSIDE OF CREATE GRAFANA YAML');
    const prometheusNum = res.locals.prometheusPorts.promCount;

    const dashboardsDoc = yaml.load(
      fs.readFileSync(
        path.resolve(
          __dirname,
          '../../grafana/provisioning/dashboards/dashboard.yml'
        ),
        'utf-8'
      )
    );
    const datasourcesDoc = yaml.load(
      fs.readFileSync(
        path.resolve(
          __dirname,
          '../../grafana/provisioning/datasources/datasource.yml'
        ),
        'utf-8'
      )
    );
    console.log('datasourcesDoc: ', datasourcesDoc); // confirmed
    // create new dataProvider object, replace the dataprovider in the original dashboard.yml and write this as a new dashboard file.
    const newDataProvider = {
      name: `prometheus${prometheusNum + 1}`,
      orgId: 1,
      folder: '',
      type: 'file',
      disableDeletion: false,
      editable: false,
      allowUiUpdates: true,
      options: {
        path: '/etc/grafana/provisioning/dashboards',
      },
    };

    dashboardsDoc.providers[0] = newDataProvider;
    const newDatasource = {
      name: `prometheus${prometheusNum + 1}`,
      type: 'prometheus',
      access: 'proxy',
      orgId: 1,
      url: 'http://prometheus:9090',
      basicAuth: false,
      isDefault: true,
      editable: true,
    };

    datasourcesDoc.datasources.push(newDatasource);

    const newDashboardYaml = yaml.dump(dashboardsDoc);
    const newDatasourcesYaml = yaml.dump(datasourcesDoc);

    fs.writeFileSync(
      path.resolve(
        __dirname,
        `../../grafana/provisioning/dashboards/dashboard${
          prometheusNum + 1
        }.yml`
      ),
      newDashboardYaml,
      'utf-8'
    );
    fs.writeFileSync(
      path.resolve(
        __dirname,
        `../../grafana/provisioning/datasources/datasource.yml`
      ),
      newDatasourcesYaml,
      'utf-8'
    );
    console.log('COMPLETED ALL FUNCS IN GRAFANAYAML');
    return next();
  } catch (err) {
    console.log('ERRORRRRRRRR IN CREATE GRAFANA');
    const error = {
      log: 'Error occurred in configControllers.createGrafanaYaml middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to create connection' },
    };
    return next(error);
  }
};

configController.createConnection = (req, res, next) => {
  // destructure ip and the port numbers from req.body and put this into the scrape-targets configuration
  // and the "cluster name" will be taken as the job name.
  // console.log(req.body, res.locals);
  try {
    const { clusterName, serverURI, ports } = req.body;
    const prometheusPorts = res.locals.prometheusPorts;
    // console.log(req.data);
    console.log('createConnection - prometheusPorts: ', prometheusPorts);
    const prometheusNum = prometheusPorts.promCount + 1;

    // load dockerCompose file from YAML and add new prometheus port to services
    const dockerCompose = yaml.load(
      fs.readFileSync(
        path.resolve(__dirname, '../../docker-compose.yml'),
        'utf-8'
      )
    );

    // update docker compose services by adding new prometheus to grafana dependencies and adding entry to services.
    dockerCompose.services.grafana.depends_on.push(
      `prometheus${prometheusNum}`
    );
    dockerCompose.services[`prometheus${prometheusNum}`] = {
      image: 'prom/prometheus:latest',
      volumes: [
        `./prometheus${prometheusNum}.yml:/etc/prometheus/prometheus.yml:ro`,
        `prometheus_data:/prometheus${prometheusNum}`,
      ],
      ports: [`${Number(prometheusPorts.maxPort) + 1}:9090`],
    };

    // define new Prometheus config file
    // config MUST return strings for ports.
    const newPromConfig = {
      global: { scrape_interval: '15s' },
      alerting: {
        alertmanagers: [{}],
      },
      rule_files: ['/etc/prometheus/rules/*.yaml'],
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
    fs.writeFileSync(
      path.resolve(__dirname, '../../docker-compose.yml'),
      newDockerYml,
      'utf-8'
    );
    fs.writeFileSync(`./prometheus${prometheusNum}.yml`, newPromYml, 'utf-8');

    exec('docker compose up -d', (err, stdout, stderr) => {
      if (err) {
        return next({
          log: 'Error while restarting Docker container',
          status: 500,
          message: { error: 'Internal server error' },
        });
      }
    });

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

module.exports = configController;
