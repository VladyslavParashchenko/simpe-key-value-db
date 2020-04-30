'use strict'

const DatabaseExporter = require('./DatabaseExporter')
const { LoggerService } = require('../Services')

class Database {
  constructor ({ backupsPath }) {
    this.storage = new Map()
    this.databaseExporter = new DatabaseExporter({ backupsPath })
  }

  set (key, value) {
    this.storage.set(key, value)

    this.exportDB()
  }

  get (key) {
    return this.storage.get(key)
  }

  delete (key) {
    this.storage.delete(key)
    this.exportDB()
  }

  exportDB () {
    this.databaseExporter.exportDatabase(this)
      .then(() => LoggerService.info('Database backupped'))
      .catch((e) => LoggerService.error('Backup error: ', e))
  }

  getDatabaseByChunk () {
    return Array.from(this.storage.entries()).reduce((acc, [key, value]) => {
      if (acc[acc.length - 1].length === Database.MAX_CHUNK_ELEMENT_COUNT) {
        acc.push({})
      }

      acc[acc.length - 1][key] = value
      return acc
    }, [{}])
  }
}

Database.MAX_CHUNK_ELEMENT_COUNT = 100

module.exports = Database
