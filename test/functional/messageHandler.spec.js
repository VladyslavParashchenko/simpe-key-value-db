'use strict'

const { expect } = require('chai')
const path = require('path')
const fs = require('fs').promises
const rimraf = require('rimraf')
const Database = require('../../app/db/Database')
const services = require('../../app/Services')
const DatabaseExporterService = require('../../app/Services/DatabaseExporter')
const fakeLogger = require('../fakeServices/FakerLoggerService')

describe('Message handlers', () => {
  const testBackupPath = path.join(process.cwd(), 'test', 'test-dir')

  let messageHandlers = null

  before(() => {
    services.replaceService('DatabaseExporter', DatabaseExporterService.instantiateService({
      backupsPath: testBackupPath,
      databaseExportTimeout: 0
    }, { LoggerService: fakeLogger }))
    services.replaceService('LoggerService', fakeLogger)

    messageHandlers = require('../../app/messageHandlers')
  })

  after(() => {
    services.restoreServices()
  })

  beforeEach(async () => {
    await fs.mkdir(testBackupPath, { recursive: true })
  })

  afterEach(async () => {
    rimraf.sync(testBackupPath)
  })

  describe('GET action', () => {
    const messageBody = {
      action: 'GET',
      payload: { key: 'test' }
    }

    context('db has data', () => {
      it('should return data by key from db', async () => {
        const database = new Database()
        const testedValue = 'testedValue'
        database.set(messageBody.payload.key, testedValue)

        const response = messageHandlers[messageBody.action](messageBody.payload, database)

        expect(response).eql({
          key: messageBody.payload.key,
          value: testedValue
        })
      })
    })

    context('database empty', () => {
      it('should return undefined, db has not data storage by this key', async () => {
        const database = new Database()

        const response = messageHandlers[messageBody.action](messageBody.payload, database)

        expect(response).eql({
          key: messageBody.payload.key,
          value: undefined
        })
      })
    })
  })

  describe('SET action', () => {
    const messageBody = {
      action: 'SET',
      payload: {
        key: 'test',
        value: 'test'
      }
    }

    it('should store data to database', async () => {
      const database = new Database()

      const response = messageHandlers[messageBody.action](messageBody.payload, database)

      expect(response).eql(messageBody.payload)
    })

    it('should backup database after insert', async () => {
      const database = new Database()

      messageHandlers[messageBody.action](messageBody.payload, database)

      const [backupDir] = await fs.readdir(testBackupPath)
      const [backupFile] = await fs.readdir(path.join(testBackupPath, backupDir))

      const backupData = require(path.join(testBackupPath, backupDir, backupFile))

      const expectedBackup = { [messageBody.payload.key]: messageBody.payload.value }
      expect(expectedBackup).eql(backupData)
    })
  })

  describe('DELETE action', () => {
    const messageBody = {
      action: 'DELETE',
      payload: { key: 'test' }
    }

    it('should delete data from database and return removed value', async () => {
      const database = new Database()
      const testedValue = 'testedValue'
      database.set(messageBody.payload.key, testedValue)

      const response = messageHandlers[messageBody.action](messageBody.payload, database)

      expect(response).eql({
        ...messageBody.payload,
        value: testedValue
      })
    })

    it('should delete data from database and backup database', async () => {
      const database = new Database()
      const testedValue = 'testedValue'
      database.set(messageBody.payload.key, testedValue)

      messageHandlers[messageBody.action](messageBody.payload, database)

      const [backupDir] = await fs.readdir(testBackupPath)
      const [backupFile] = await fs.readdir(path.join(testBackupPath, backupDir))

      const backupData = require(path.join(testBackupPath, backupDir, backupFile))
      expect(backupData).eql({})
    })

    it('should try to delete nonexistence data, return undefined as removed value', async () => {
      const database = new Database()

      const response = messageHandlers[messageBody.action](messageBody.payload, database)

      expect(response).eql({
        ...messageBody.payload,
        value: undefined
      })
    })
  })
})
