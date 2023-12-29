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

// this way, we can test what res.status, res.json, and res.send were called with ('toHaveBeenCalledWith')
const mockRes = () => {
  const res = {};
  res.locals = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

const mockNext = jest.fn();

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

  const mockDatasourceYml = {
    apiVersion: '1',
    dataSources: []
  }

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
  }

  return {
    dockerCompose: mockDockerCompose,
    prometheusService: mockPrometheusService,
    datasourceYml: mockDatasourceYml,
    datasources: mockDatasources,
    prometheus: mockPrometheus
  }
}

module.exports = {
  mockReq,
  mockRes,
  mockNext,
  getMockConfigs
}