// const Store = require('electron-store');
const fs = require('fs');
// const Buffer = require('node:buffer')
const path = require('path');
const { exec } = require('node:child_process');

// external JS libraries for writing Kafka scripts and for writing YAML files
const kafka = require('kafkajs');
const yaml = require('js-yaml');

// not sure what this is...
const { default: cluster } = require('cluster');

const configControllers = {};

configControllers.getPrometheusPorts = (req, res, next) => {
  // console.log('getting max Prometheus port number!')
  try {
    const dockerCompose = yaml.load(
      fs.readFileSync(
        path.resolve(__dirname, '../../docker-compose.yml'),
        'utf-8'
      )
    );
    const prometheusPorts = {
      maxPort: 0,
    };
    for (let key in dockerCompose.services) {
      // check if the key contains the string 'prometheus.' If so, update the maxPort.
      if (key.toLowerCase().includes('prometheus')) {
        const outerPort = dockerCompose.services[key].ports[0].replace(
          /\:\d*/,
          ''
        );
        if (Number(outerPort) > Number(prometheusPorts.maxPort)) {
          prometheusPorts.maxPort = outerPort;
        }
      }
    }

    res.locals.prometheusPorts = prometheusPorts;
    // console.log(res.locals);
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

configControllers.updateGrafana = (req, res, next) => {
  // console.log('creating Grafana Yamls!')
  try {
    const { id } = req.body;
    const datasourceDoc = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../grafana/provisioning/datasources/datasource.yml'), 'utf-8'))

    // create dataSource object to append to yml files.
    // Only a single provisioning provider is necessary to provision the Grafana dashboard with multiple prometheus datasources, since we are using templating to allow users to pick which prometheus instance they will be pulling from.
    // If we want more separation, we will have to generate a new dashboard.json file for each dashboard we create.


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

    if (!datasourceDoc.datasources) {
      datasourceDoc.datasources = [newDatasource];
    } else {
      datasourceDoc.datasources.push(newDatasource);
    };



    const newDatasourcesYaml = yaml.dump(datasourceDoc, {
      indent: 2,
      noArrayIndent: true
    });

    fs.writeFileSync(path.resolve(__dirname, '../../grafana/provisioning/datasources/datasource.yml'), newDatasourcesYaml, 'utf-8');

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

configControllers.updateDocker = (req, res, next) => {
  // destructure ip and the port numbers from req.body and put this into the scrape-targets configuration
  // and the "cluster name" will be taken as the job name.
  try {

    const { id, name, uri, ports } = req.body;
    const { maxPort } = res.locals.prometheusPorts;

    // load dockerCompose file from YAML for editing.
    const dockerCompose = yaml.load(
      fs.readFileSync(
        path.resolve(__dirname, '../../docker-compose.yml'),
        'utf-8'
      )
    );

    // update docker compose services by adding new prometheus to grafana dependencies and adding entry to services.


    if (!dockerCompose.services.grafana.depends_on) {
      dockerCompose.services.grafana.depends_on = [`prometheus${id}`]
    } else {
      dockerCompose.services.grafana.depends_on.push(`prometheus${id}`);
    };


    dockerCompose.services[`prometheus${id}`] = {
      image: 'prom/prometheus:latest',
      volumes: [
        `./prometheus${id}.yml:/etc/prometheus/prometheus.yml:ro`,
        `prometheus_data:/prometheus${id}`,
        './kafka_controller_alerts.yml:/etc/prometheus/kafka_controller_alerts.yml'
      ],
      ports: [`${maxPort === 0 ? 9090 : Number(maxPort) + 1}:9090`]
    };

    // Defining new targets for scraping. Currently configured to map ports to URI for development cluster, but should be reconfigured for production environments to map IP addresses/URIs to new targets.
    const newTargets = ports.map((port) => {
      return `${uri}:${port}`;
    });
    // console.log('newTargets: ', newTargets);

    const newPromConfig = {
      global: { scrape_interval: '15s' },
      alerting: {
        alertmanagers: [{
          static_configs: [
            { targets: ['host.docker.internal:6093'] }
          ]
        }]
      },
      rule_files: ['/etc/prometheus/rules/*.yml'],
      scrape_configs: [
        {
          job_name: name,
          static_configs: [
            {
              targets: newTargets
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
    // console.log('Writing files to directory')
    fs.writeFileSync(path.resolve(__dirname, '../../docker-compose.yml'), newDockerYml, 'utf-8');
    fs.writeFileSync(path.resolve(__dirname, `../../prometheus${id}.yml`), newPromYml, 'utf-8');

    // compose any new containers (for prometheus instances). Remove anything that's been deleted.
    // console.log('restarting docker...')
    exec('docker compose up -d --remove-orphans', (err, stdout, stderr) => {
      if (err) {
        return next({
          log: 'Error while restarting Docker container',
          status: 500,
          message: { error: 'Failed to update Prometheus instances' },
        });
      };
    });

    return next();

  } catch {
    const error = {
      log: 'Error occurred in configControllers.createConnection middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to create connection' },
    };
    return next(error);
  };
};

configControllers.deleteConnections = (req, res, next) => {
  try {
    const { clusters } = req.body;


    const datasourceDoc = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../grafana/provisioning/datasources/datasource.yml'), 'utf-8'));
    const dockerCompose = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../docker-compose.yml'), 'utf-8'));

    // let's just go through the clusters and go through the documents one by one, deleting what we need.
    for (let id of clusters) {
      // index for searching through documents arrays.
      let ind = 0;
      // splicing out datasource from datasources
      for (let datasource of datasourceDoc.datasources) {
        if (datasource.name === `prometheus${id}`) {
          datasourceDoc.datasources.splice(ind, 1)
          break;
        };
        ind++;
      };
      ind = 0;

      // for dockerCompose, we'll have to do this process for just the depends_on array.
      for (let dep of dockerCompose.services.grafana.depends_on) {
        if (dep === `prometheus${id}`) {
          dockerCompose.services.grafana.depends_on.splice(ind, 1)
          break;
        };
        ind++;
      };
      // and delete each property in dockerCompose.services that has the name prometheus${id}.
      delete dockerCompose.services[`prometheus${id}`]

      exec(`rm prometheus${id}.yml`, (err, stdout, stderr) => {
        if (err) {
          return next({
            log: 'Error while removing Prometheus yaml files.',
            status: 500,
            message: { error: 'Failed to update Prometheus instances' },
          })
        };
      });
    };

    // if the depends_on array is empty, make sure it is deleted.
    if (!dockerCompose.services.grafana.depends_on.length) {
      delete dockerCompose.services.grafana.depends_on;
    };

    // Write files back to yaml.
    // const newDashboardYaml = yaml.dump(dashboardDoc, {
    //   indent: 2,
    //   noArrayIndent: true
    // });
    const newDatasourcesYaml = yaml.dump(datasourceDoc, {
      indent: 2,
      noArrayIndent: true
    });
    const newDockerYml = yaml.dump(dockerCompose, {
      indent: 2,
      noArrayIndent: true,
    });

    // Write them into the directory
    fs.writeFileSync(path.resolve(__dirname, '../../grafana/provisioning/datasources/datasource.yml'), newDatasourcesYaml, 'utf-8');
    fs.writeFileSync(path.resolve(__dirname, '../../docker-compose.yml'), newDockerYml, 'utf-8');

    // Restart docker, get rid of old containers.
    exec('docker compose up -d --remove-orphans', (err, stdout, stderr) => {
      if (err) {
        return next({
          log: 'Error while restarting Docker container',
          status: 500,
          message: { error: 'Failed to update Prometheus instances' },
        });
      };
    });

    res.locals.configResponse = 'Successfully removed clusters and udpated configurations.';
    return next();
  }
  catch (error) {
    const err = Object.assign({}, {
      log: 'Error occurred while deleting connections from config files',
      status: 500,
      message: "Couldn't delete from configurations"
    }, error)
    return next(err);
  };
};

module.exports = configControllers;
