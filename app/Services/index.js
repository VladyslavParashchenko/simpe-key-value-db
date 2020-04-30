'use strict'

const LoggerService = require('./logger')
const AMQPService = require('./AMPQ')

const services = {
  LoggerService: LoggerService.instantiateService(require('../../configs/loggerConfig')),
  AMQPService: AMQPService.instantiateService(require('../../configs/loggerConfig'))
}

module.exports = services
