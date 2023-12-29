/**
 * Defining mock utility objects/functions for express back end.
 */

const mockReq = () => {
  return {
    body: {},
    params: {},
    query: {}
  }
}

// this way, we can test what res.status, res.json, and res.send were called with ('toHaveBeenCalledWith(....)'). We can also provide res.locals so we can check what has been saved by the function.
const mockRes = () => {
  const res = {};
  res.locals = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

// we can check if next is called with nothing, or we expect it "to have been called witH" an objected expected to contain the properties of the error object from the middleware function.

// syntax: expect(next).toHaveBeenCalledWith(expect.objectContaining({errorObjFromMiddleware}))
const mockNext = jest.fn();

// function to generate mock configuration files that can be destructured.
const getMockConfigs = () => {

  const mockDockerCompose = {
    version: '3.8',
    services: {
      grafana: {
        image: 'grafana'
      }
    }
  };

  const mockPrometheusService = {
    ports: [
      '9093:9090'
    ]
  };

  const mockDatasourceDoc = {
    apiVersion: '1',
    dataSources: []
  };

  const mockDatasources = {
    name: 'prometheus1'
  }

  const mockPrometheus = {
    scrape_configs: [
      {
        job_name: 'mock',
        static_configs: [
          {
            targets: []
          }
        ]
      }
    ]
  };

  return {
    dockerCompose: mockDockerCompose,
    prometheusService: mockPrometheusService,
    datasourceYml: mockDatasourceDoc,
    datasources: mockDatasources,
    prometheus: mockPrometheus
  };
};

module.exports = {
  mockReq,
  mockRes,
  mockNext,
  getMockConfigs
};