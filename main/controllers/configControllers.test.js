const fs = require('fs');
const yaml = require('js-yaml');
const configControllers = require('./configControllers');
const { mockRes, mockReq, mockNext } = require('../__mocks__/express')


const getMockYmls = () => {

  const mockDockerComposeYml = `
  version: 3.8
  services:
    grafana:
      - image: grafana
  `

}



describe('getPrometheusPorts finds and returns maximum Promtheus port', () => {




})