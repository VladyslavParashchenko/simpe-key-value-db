'use strict'

const { DatabaseExporter, LoggerService } = require('./Services').getAppServices()

module.exports = {
  SET: ({ key, value }, db) => {
    db.set(key, value)
    exportDatabase(db)
    return {
      key,
      value
    }
  },
  GET: ({ key }, db) => {
    db.get(key)
    return { key, value: db.get(key) }
  },
  DELETE: ({ key }, db) => {
    const { value } = db.get(key)
    db.delete(key)
    exportDatabase(db)

    return {
      key,
      value
    }
  }
}

function exportDatabase (database) {
  DatabaseExporter
    .exportDatabase(database)
    .then(() => LoggerService.info('Database exported!'))
    .catch((e) => LoggerService.error('Database export error', e))
}
