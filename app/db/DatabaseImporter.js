'use strict'

const fs = require('fs').promises
const path = require('path')
const { LoggerService } = require('../Services')
const Database = require('.')

class DatabaseImporter {

  constructor (databaseConfig) {
    this.databaseConfig = databaseConfig
  }

  async restoreDatabase () {
    const { backupsPath } = this.databaseConfig

    const dirFileNames = await fs.readdir(backupsPath)
    const latestBackup = dirFileNames.sort().pop()

    const database = new Database(this.databaseConfig)
    if (!latestBackup) {
      return database
    }

    const backups = await this.restoreBackups(path.join(backupsPath, latestBackup))
    for (const backup of backups) {
      Object.entries(backup).forEach(([key, value]) => database.set(key, value))
    }

    LoggerService.info(`Database restored from ${latestBackup} backup`)

    return database
  }

  async restoreBackups (latestBackupPath) {
    const dirFileNames = await fs.readdir(latestBackupPath)
    return Promise
      .all(dirFileNames.map(fileName => this.restoreBackupFile(path.join(latestBackupPath, fileName))))
  }

  async restoreBackupFile (filePath) {
    const fileData = await fs.readFile(filePath, { encoding: 'UTF-8' })
    return JSON.parse(fileData)
  }
}

module.exports = DatabaseImporter
