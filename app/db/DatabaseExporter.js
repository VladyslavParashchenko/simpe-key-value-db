'use strict'

const fs = require('fs').promises
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { LoggerService } = require('../Services')

class DatabaseExporter {
  constructor (config) {
    this.config = config
  }

  async exportDatabase (database) {
    const promises = []

    const pathToBackup = this.buildBackupChunkPath()
    await fs.mkdir(pathToBackup, { recursive: true })

    for (const dataChunk of database.getDatabaseByChunk()) {
      promises.push(this.saveDatabaseChunk(pathToBackup, dataChunk))
    }
    Promise.all(promises).then().catch((e) => LoggerService.error(e.stack))
  }

  saveDatabaseChunk (dirPath, chunkData) {
    return fs.writeFile(path.join(dirPath, `${uuidv4()}.json`), JSON.stringify(chunkData))
  }

  buildBackupChunkPath () {
    return path.join(this.config.backupsPath, Date.now().toString())
  }
}

module.exports = DatabaseExporter
