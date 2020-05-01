'use strict'

const path = require('path')

module.exports = {
  databaseExportTimeout: 1000,
  backupsPath: path.join(process.cwd(), 'backups')
}
