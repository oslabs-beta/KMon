const configControllers = require('../configControllers');
const fs = require('fs');
const yaml = require('js-yaml');
const { exec } = require('node:child_process');
const { mockRes, mockReq, mockNext, getMockConfigs } = require('../../__mocks__/express');
const { config } = require('dotenv');

jest.mock('fs');
jest.mock('js-yaml');
jest.mock('node:child_process')

describe('configControllers', () => {

  it('should be an object', () => {

    expect(configControllers).toBeInstanceOf(Object);
  });

  it('should have a getPrometheusPorts method', () => {

    expect(configControllers.getPrometheusPorts).not.toBe(undefined);
    expect(configControllers.getPrometheusPorts).toBeInstanceOf(Function);
  });

  it('should have a updateGrafana method', () => {

    expect(configControllers.updateGrafana).not.toBe(undefined);
    expect(configControllers.updateGrafana).toBeInstanceOf(Function);
  });

  it('should have a updateDocker method', () => {

    expect(configControllers.updateDocker).not.toBe(undefined);
    expect(configControllers.updateDocker).toBeInstanceOf(Function);
  });

  it('should have a deleteConnections method', () => {

    expect(configControllers.deleteConnections).not.toBe(undefined);
    expect(configControllers.deleteConnections).toBeInstanceOf(Function);
  });

})

describe('configControllers.getPrometheusPorts', () => {

  let dockerCompose;
  let prometheusService;
  let res;
  let req;
  const next = mockNext;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    ({ dockerCompose, prometheusService } = getMockConfigs());
    res = mockRes();
    req = mockReq();
    yaml.load.mockReturnValue(dockerCompose);
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetModules();
  })

  it('should save an object called prometheusPorts to res.locals', () => {

    configControllers.getPrometheusPorts(req, res, next)

    expect(res.locals.prometheusPorts).toBeInstanceOf(Object);
    expect(next).toHaveBeenCalledWith();
  });

  it('should have maxPort of 0 if there are no prometheus services', () => {

    configControllers.getPrometheusPorts(req, res, next)

    expect(res.locals.prometheusPorts.maxPort).toBe(0);
    expect(next).toHaveBeenCalledWith();
  });

  it('should assign maxPort equal to port of any prometheus instances', () => {

    dockerCompose.services.prometheus1 = { ...prometheusService };
    dockerCompose.services.prometheus2 = { ...prometheusService };
    dockerCompose.services.prometheus3 = { ...prometheusService };
    dockerCompose.services.prometheus1.ports = ['9094:9090']
    dockerCompose.services.prometheus2.ports = ['9095:9090'];
    dockerCompose.services.prometheus3.ports = ['9092:9090'];

    configControllers.getPrometheusPorts(req, res, next);

    expect(res.locals.prometheusPorts.maxPort).toBe('9095');
    expect(next).toHaveBeenCalledWith();
  });

  it('should return an error if the directory is invalid', () => {

    fs.readFileSync.mockImplementation(() => {
      throw new Error()
    })

    configControllers.getPrometheusPorts(req, res, next);

    expect(res.locals.prometheusPorts).toBe(undefined)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred in configControllers.getPrometheusPorts middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to identify ports' },
    }));
  });

  it('should return an error if the yaml file is corrupted or malwritten', () => {

    yaml.load.mockImplementation(() => {
      throw new Error()
    })

    configControllers.getPrometheusPorts(req, res, next);

    expect(res.locals.prometheusPorts).toBe(undefined)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred in configControllers.getPrometheusPorts middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to identify ports' },
    }));
  });

});

describe('configControllers.updateGrafana', () => {

  let id;
  let datasourceDoc;
  let datasources;
  let res;
  let req;
  const next = mockNext;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    id = Math.floor(1 + (9 * Math.random()));
    res = mockRes();
    req = mockReq();
    req.body.id = id;
    ({ datasourceDoc, datasources } = getMockConfigs());
  })

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetModules();
  })

  it('should return an error if the directory is invalid', () => {

    fs.readFileSync.mockImplementation(() => {
      throw new Error();
    });

    configControllers.updateGrafana(req, res, next);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred in configControllers.createGrafanaYaml middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to create connection' },
    }));
  });

  it('should return an error if the yaml file is corrupted or malformed', () => {

    yaml.load.mockImplementation(() => {
      throw new Error();
    })

    configControllers.updateGrafana(req, res, next);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred in configControllers.createGrafanaYaml middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to create connection' },
    }));
  });

  it('should add a new datasource to the yaml file with the correct id', () => {

    // console.log(req.body);
    // console.log(datasourceDoc, datasources)
    fs.readFileSync.mockImplementation(() => { })

    yaml.load.mockImplementation(() => {
      return datasourceDoc;
    })

    configControllers.updateGrafana(req, res, next);

    // console.log(datasourceDoc, datasources)

    expect(datasourceDoc.datasources[0].name).toBe(`prometheus${id}`)
  });

  it('should write this updated object to yaml', () => {
    fs.readFileSync.mockImplementation(() => { })

    yaml.load.mockImplementation(() => {
      return datasourceDoc;
    })

    yaml.dump.mockReturnValue(`mockYaml`)

    configControllers.updateGrafana(req, res, next);

    expect(yaml.dump).toHaveBeenCalledWith(
      expect.objectContaining(datasourceDoc),
      expect.objectContaining({
        indent: 2, noArrayIndent: true
      }));
  });
});

describe('configControllers.updateDocker', () => {

  let id, res, req, name, uri, ports, dockerCompose, maxPort;
  const next = mockNext;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    id = Math.floor(1 + (9 * Math.random()));
    maxPort = 9090 + Math.floor(9 * Math.random());
    res = mockRes();
    req = mockReq();
    res.locals.prometheusPorts = {};
    res.locals.prometheusPorts.maxPort = maxPort;
    req.body.id = id;
    req.body.name = 'test';
    req.body.seedBrokers = ['1.2.3.4:1234', 'demohost.com:2345', 'demo-kafka-cluster:3456'];
    ({ dockerCompose } = getMockConfigs());
  })

  afterAll(() => {
    jest.resetModules();
    jest.clearAllMocks();
  })

  it('should return an error if the directory is invalid', () => {

    fs.readFileSync.mockImplementation(() => {
      throw new Error();
    });

    configControllers.updateDocker(req, res, next);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred in configControllers.createConnection middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to create connection' },
    }));
  });

  it('should return an error if the yaml file is corrupted or malformed', () => {

    yaml.load.mockImplementation(() => {
      throw new Error();
    })

    fs.readFileSync.mockImplementation(() => {
      return ``
    })

    configControllers.updateDocker(req, res, next);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred in configControllers.createConnection middleware function',
      status: 500,
      message: { err: 'Error occurred while trying to create connection' },
    }));
  });

  it('should add prometheus instance to the grafana dependencies array', () => {

    fs.readFileSync.mockImplementation(() => { });

    yaml.load.mockReturnValue(dockerCompose);

    configControllers.updateDocker(req, res, next);

    expect(dockerCompose.services.grafana.depends_on.includes(`prometheus${id}`)).toBe(true);
  })

  it('should add new prometheus instance to dockerCompose.services', () => {

    fs.readFileSync.mockImplementation(() => { });

    yaml.load.mockReturnValue(dockerCompose);

    configControllers.updateDocker(req, res, next);

    expect(dockerCompose.services[`prometheus${id}`]).toBeInstanceOf(Object);

  })

  it('should assign a port number greater than the current max Prometheus port to the new Prometheus instance', () => {

    fs.readFileSync.mockImplementation(() => { });

    yaml.load.mockReturnValue(dockerCompose);

    configControllers.updateDocker(req, res, next);

    expect(dockerCompose.services[`prometheus${id}`].ports).toEqual([`${maxPort + 1}:9090`]);

  })

  it('should create an array of targets using the URI and Ports for creating prometheus yaml', () => {

    const { seedBrokers } = req.body;

    fs.readFileSync.mockImplementation(() => { });

    yaml.load.mockReturnValue(dockerCompose);

    configControllers.updateDocker(req, res, next);

    expect(yaml.dump).toHaveBeenCalledWith(
      expect.objectContaining({
        scrape_configs: [
          {
            job_name: 'test',
            static_configs: [
              { targets: seedBrokers }
            ]
          }
        ]
      }),
      expect.objectContaining({
        indent: 2, noArrayIndent: true
      }))
  })

  it('should try to write these files to a path', () => {

    fs.readFileSync.mockImplementation(() => { });

    yaml.load.mockReturnValue(dockerCompose);

    yaml.dump.mockImplementation(() => {
      return `mockyaml`
    })

    fs.writeFileSync.mockImplementation(() => { });

    configControllers.updateDocker(req, res, next);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
  })

  // could add a test case for writeFileSync throwing an error

  it('should run a CLI command to restart docker and remove any orphan containers', () => {

    fs.readFileSync.mockImplementation(() => { });

    yaml.load.mockReturnValue(dockerCompose);

    configControllers.updateDocker(req, res, next);

    expect(exec.mock.calls[0][0]).toEqual('docker compose up -d --remove-orphans');
  })

  // can also check for the error message in 'exec' command in case docker-compose command doesn't work.

})

describe('deleteConnections', () => {

  let clusters, datasourceDoc, datasource, dockerCompose, prometheusService, req, res
  const next = mockNext;

  const generateRandomClusterIds = () => {
    // create 5 random unique numbers between 1 and m.
    const ids = [];
    while (ids.length < 3) {
      const id = 1 + Math.floor((10 * Math.random()));
      if (!ids.includes(id)) {
        ids.push(id);
      }
    }
    return ids;
  }

  const generateDatasourceDoc = () => {
    ({ datasourceDoc, datasource } = getMockConfigs());

    for (let i = 1; i < 11; i++) {
      datasource.name = `prometheus${i}`
      datasourceDoc.datasources.push({ ...datasource })
    }

    return datasourceDoc;
  }

  const generateDockerCompose = () => {

    ({ dockerCompose, prometheusService } = getMockConfigs());
    dockerCompose.services.grafana.depends_on = [];

    for (let i = 1; i < 11; i++) {
      const newPrometheusService = { ...prometheusService };
      newPrometheusService.ports.push(`${9089 + i}:9090`);
      dockerCompose.services.grafana.depends_on.push(`prometheus${i}`);
      dockerCompose.services[`prometheus${i}`] = newPrometheusService;
    }

    return dockerCompose;
  }

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    clusters = generateRandomClusterIds();
    req = mockReq();
    res = mockRes();
    req.body.clusters = clusters;
    // mock up yaml.load to provide new datasourceDoc on first call, dockerCompose on second call.
    fs.readFileSync.mockReturnValue();
    datasourceDoc = generateDatasourceDoc();
    dockerCompose = generateDockerCompose();
  })

  afterAll(() => {
    jest.resetModules();
    jest.clearAllMocks();
  })

  it('should return an error if the directory is invalid', () => {

    fs.readFileSync.mockImplementation(() => {
      throw new Error();
    });

    configControllers.deleteConnections(req, res, next);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred while deleting connections from config files',
      status: 500,
      message: "Couldn't delete from configurations"
    }));
  });

  it('should return an error if the yaml file is corrupted or malformed', () => {

    yaml.load.mockImplementation(() => {
      throw new Error();
    })

    fs.readFileSync.mockImplementation(() => {
      return ``
    })

    configControllers.deleteConnections(req, res, next);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred while deleting connections from config files',
      status: 500,
      message: "Couldn't delete from configurations"
    }));
  });

  it('should remove specified prometheus instances from datasourceDoc.datasources', () => {

    yaml.load.mockReturnValueOnce(datasourceDoc).mockReturnValueOnce(dockerCompose)

    configControllers.deleteConnections(req, res, next);

    for (let id of clusters) {
      for (let datasource of datasourceDoc.datasources) {
        expect(datasource.name !== `prometheus${id}`).toBe(true);
      }
    };
  });

  it('should remove specified prometheus instances from dockerCompose', () => {

    yaml.load.mockReturnValueOnce(datasourceDoc).mockReturnValueOnce(dockerCompose)

    configControllers.deleteConnections(req, res, next);

    for (let id of clusters) {

      for (let dep of dockerCompose.services.grafana.depends_on) {
        expect(dep !== `prometheus${id}`).toBe(true);
      };

      expect(dockerCompose.services[`prometheus${id}`]).toBe(undefined);
    };
  });

  it('should run a command to remove the id', () => {

    yaml.load.mockReturnValueOnce(datasourceDoc).mockReturnValueOnce(dockerCompose)

    configControllers.deleteConnections(req, res, next);

    for (let i = 0; i < clusters.length; i++) {
      expect(exec.mock.calls[i][0]).toBe(`rm prometheus${clusters[i]}.yml`);
    };
  })

  it('should throw an error if a malformed command is entered', () => {

    exec.mockImplementation(() => { throw new Error() });

    yaml.load.mockReturnValueOnce(datasourceDoc).mockReturnValueOnce(dockerCompose)

    configControllers.deleteConnections(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      log: 'Error occurred while deleting connections from config files',
      status: 500,
      message: "Couldn't delete from configurations"
    }))

    exec.mockReset();
  })

  it('should get rid of the grafana.depends_on property completely if it is emptied', () => {

    yaml.load.mockReturnValueOnce(datasourceDoc).mockReturnValueOnce(dockerCompose)

    req.body.clusters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    configControllers.deleteConnections(req, res, next);

    expect(dockerCompose.services.grafana.depends_on).toBe(undefined);
  })

  it('should write these files to yaml', () => {

    yaml.load.mockReturnValueOnce(datasourceDoc).mockReturnValueOnce(dockerCompose);

    configControllers.deleteConnections(req, res, next);

    expect(yaml.dump).toHaveBeenCalledTimes(2);

    expect(yaml.dump.mock.calls[0][0]).toEqual(expect.objectContaining(datasourceDoc));
    expect(yaml.dump.mock.calls[1][0]).toEqual(expect.objectContaining(dockerCompose));

  });

  it('should write these files to a directory', () => {

    yaml.load.mockReturnValueOnce(datasourceDoc).mockReturnValueOnce(dockerCompose);

    yaml.dump.mockReturnValueOnce(`yaml1`).mockReturnValueOnce('yaml2')

    configControllers.deleteConnections(req, res, next);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);

    expect(fs.writeFileSync.mock.calls[0][1]).toBe(`yaml1`);
    expect(fs.writeFileSync.mock.calls[1][1]).toBe(`yaml2`);
  });

  it('should restart Docker', () => {

    yaml.load.mockReturnValueOnce(datasourceDoc).mockReturnValueOnce(dockerCompose);

    configControllers.deleteConnections(req, res, next);

    expect(exec.mock.calls[clusters.length][0]).toBe('docker compose up -d --remove-orphans');
    expect(res.locals.configResponse).toBe('Successfully removed clusters and udpated configurations.');
    expect(next).toHaveBeenCalledWith();
  });

});