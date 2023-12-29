const configControllers = require('./configControllers');
const fs = require('fs');
const yaml = require('js-yaml');
const { mockRes, mockReq, mockNext, getMockConfigs } = require('../__mocks__/express')

const res = mockRes();
const req = mockReq();
const next = mockNext;

jest.mock('fs');
jest.mock('js-yaml');

describe('getPrometheusPorts finds and returns maximum Promtheus port', () => {


  const { dockerCompose, prometheusService } = getMockConfigs()
  yaml.load.mockReturnValue(dockerCompose);

  it('should save an object called prometheusPorts to res.locals', () => {

    configControllers.getPrometheusPorts(req, res, next)

    expect(res.locals.prometheusPorts).toBeInstanceOf(Object);

  })

  it('should have maxPort of 0 if there are no prometheus services', () => {

    configControllers.getPrometheusPorts()

    expect(res.locals.prometheusPorts.maxPorts).toBe(0)
  })

  it('should assign maxPort equal to port of any prometheus instances', () => {

    dockerCompose.services.prometheus1 = prometheusService;

    configControllers.getPrometheusPorts();

    expect(res.locals.prometheusPorts.maxPorts).toBe('9093')
  })

})