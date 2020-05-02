'use strict'

const { expect } = require('chai')
const path = require('path')
const fs = require('fs').promises
const rimraf = require('rimraf')
const testBackupPath = path.join(process.cwd(), 'test', 'test-dir')
const DatabaseExporterService = require('../../app/Services/DatabaseExporter')
const Database = require('../../app/db/Database')
const fakeLogger = require('../fakeServices/FakerLoggerService')

describe('Database backup', () => {
  let backupService = null

  beforeEach(async () => {
    backupService = DatabaseExporterService.instantiateService({
      backupsPath: testBackupPath,
      databaseExportTimeout: 0
    }, { LoggerService: fakeLogger })

    await fs.mkdir(testBackupPath, { recursive: true })
  })

  afterEach(async () => {
    rimraf.sync(testBackupPath)
  })

  const dbData = {
    test1: 'value1',
    test2: 'value2'
  }

  it('should export database data to file', async () => {
    const database = new Database()
    Object.entries(dbData).forEach(([key, value]) => database.set(key, value))

    backupService.exportDatabase(database)

    const [backupDir] = await fs.readdir(testBackupPath)
    const [backupFile] = await fs.readdir(path.join(testBackupPath, backupDir))

    const backupData = require(path.join(testBackupPath, backupDir, backupFile))

    expect(dbData).eql(backupData)
  })

  it('should export database data to several files', async () => {
    Database.MAX_CHUNK_ELEMENT_COUNT = 1
    const database = new Database()
    Object.entries(dbData).forEach(([key, value]) => database.set(key, value))

    backupService.exportDatabase(database)

    const [backupDir] = await fs.readdir(testBackupPath)
    const backupsFiles = await fs.readdir(path.join(testBackupPath, backupDir))
    expect(backupsFiles.length).equal(Object.keys(dbData).length)

    const backupData = {}
    backupsFiles.forEach(backupFile => {
      Object.assign(backupData, require(path.join(testBackupPath, backupDir, backupFile)))
    })

    expect(dbData).eql(backupData)
  })
})
