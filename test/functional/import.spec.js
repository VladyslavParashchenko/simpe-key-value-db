'use strict'

const { expect } = require('chai')
const path = require('path')
const testBackupPath = path.join(process.cwd(), 'test', 'resources', 'test-backups')
const db = require('../../app/db')
const Database = require('../../app/db/Database')

describe('Database restore from backup', () => {
  let backupsData = null

  before(() => {
    backupsData = {
      ...require('../resources/test-backups/latest-test-backup/backup-file-1.json'),
      ...require('../resources/test-backups/latest-test-backup/backup-file-2.json')
    }
  })

  it('should return database instance', async () => {
    const dbInstance = await db.restoreDatabase({ backupsPath: testBackupPath })

    expect(dbInstance).to.be.an.instanceOf(Database)
  })

  it('should db has required values', async () => {
    const dbInstance = await db.restoreDatabase({ backupsPath: testBackupPath })

    for (const [key, value] of Object.entries(backupsData)) {
      expect(dbInstance.get(key)).equal(value)
    }
  })
})
