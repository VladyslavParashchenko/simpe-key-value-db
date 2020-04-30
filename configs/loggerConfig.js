'use strict'

const winston = require('winston')

module.exports = {
  level: 'info',
  format: winston.format.json(),
  fileTransports: [
    { filename: 'logs/error.log', level: 'error' },
    { filename: 'logs/app.log' }
  ],
  consoleTransports: [
    {}
  ]
}
