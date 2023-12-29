const configControllers = require('../configControllers');
const fs = require('fs');
const yaml = require('js-yaml');
const { mockRes, mockReq, mockNext, getMockConfigs } = require('../../__mocks__/express')

jest.mock('fs');
jest.mock('js-yaml');

describe('configControllers.getPrometheusPorts', () => {

  let dockerCompose;
  let prometheusService;
  let res;
  let req;
  const next = mockNext;

  beforeEach(() => {
    ({ dockerCompose, prometheusService } = getMockConfigs());
    res = mockRes();
    req = mockReq();
    yaml.load.mockReturnValue(dockerCompose);
  });

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
    id = Math.floor(1 + (9 * Math.random()));
    res = mockRes();
    req = mockReq();
    req.body.id = id;
    ({ datasourceDoc, datasources } = getMockConfigs());
  })

  it('should return an error if the directory is invalid', () => {

    fs.readFileSync.mockImplementation(() => {
      throw new Error();
    });
    // fs.writeFileSync.mockImplementation(() => { });
    // console.log('updateGrafana.describe datasourceDoc, datasources', datasourceDoc, datasources)
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

    yaml.load.mockImplementation(() => {
      return datasourceDoc;
    })

    configControllers.updateGrafana(req, res, next);

    expect(datasourceDoc.datasources)

  })




});