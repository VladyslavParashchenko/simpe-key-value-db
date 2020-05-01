'use strict'

const LoggerService = require('./Logger')
const AMQPService = require('./AMPQ')
const DatabaseExporter = require('./DatabaseExporter')

const servicesConfig = [
  {
    serviceName: 'LoggerService',
    serviceModule: LoggerService,
    serviceConfig: require('../../configs/loggerConfig'),
    dependOn: []
  },
  {
    serviceName: 'AMQPService',
    serviceModule: AMQPService,
    serviceConfig: require('../../configs/ampqConfig'),
    dependOn: ['LoggerService']
  },
  {
    serviceName: 'DatabaseExporter',
    serviceModule: DatabaseExporter,
    serviceConfig: require('../../configs/databaseConfig'),
    dependOn: ['LoggerService']
  }
]

module.exports = (() => {
  let services = {}

  for (const { serviceName, serviceModule, serviceConfig = {}, dependOn } of servicesConfig) {
    services[serviceName] = serviceModule.instantiateService(
      serviceConfig,
      dependOn.reduce((dependencies, dependencyName) => {
        dependencies[dependencyName] = services[dependencyName]
        return dependencies
      }, {})
    )
  }

  const originalServices = { ...services }

  return {
    getAppServices: () => services,
    replaceService: (serviceName, fakeService) => {
      services[serviceName] = fakeService
      return services
    },
    restoreServices: () => {
      services = { ...originalServices }
    }
  }
})()
