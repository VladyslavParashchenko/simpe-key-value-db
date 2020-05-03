'use strict'

const winston = require('winston')

function instantiateService (serviceConfig = {}) {
  const { fileTransports = [], consoleTransports = [], ...loggerOptions } = serviceConfig
  const logger = winston.createLogger({
    loggerOptions,
    transports: [
      ...fileTransports.map(transportConfig => new winston.transports.File(transportConfig)),
      ...consoleTransports.map(transportConfig => new winston.transports.Console(transportConfig))
    ]
  })

  return {
    info (...options) {
      logger.info(...options)
    },

    error (msg, err) {
      logger.error(`${msg} error: err_name: ${err.name}, err_stack: ${err.stack}`)
    }
  }
}

module.exports = { instantiateService }
