const configControllers = require('./configControllers')

test('getPrometheusPorts finds and returns maximum Promtheus port', () => {

  const testDockerCompose = {
    version: '3.8',
    services: {
      grafana: {
        image: 'grafana'
      }
    }
  }

  const testPrometheus = {
    prometheus: {

    }
  }

  beforeEach()



})