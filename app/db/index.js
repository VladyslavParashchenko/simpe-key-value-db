'use strict'

const Database = require('./Database')
const fs = require('fs').promises
const path = require('path')
const { LoggerService } = require('../Services').getAppServices()

async function restoreDatabase ({ backupsPath }) {
  const dirFileNames = await fs.readdir(backupsPath)
  const latestBackup = dirFileNames.sort().pop()

  const database = new Database()
  if (!latestBackup) {
    return database
  }

  const backups = await restoreBackups(path.join(backupsPath, latestBackup))
  for (const backup of backups) {
    Object.entries(backup).forEach(([key, value]) => database.set(key, value))
  }

  LoggerService.info(`Database restored from ${latestBackup} backup`)

  return database
}

async function restoreBackups (latestBackupPath) {
  const dirFileNames = await fs.readdir(latestBackupPath)
  return Promise
    .all(dirFileNames.map(fileName => restoreBackupFile(path.join(latestBackupPath, fileName))))
}

async function restoreBackupFile (filePath) {
  const fileData = await fs.readFile(filePath, { encoding: 'UTF-8' })
  return JSON.parse(fileData)
}

module.exports = {
  restoreDatabase
}
