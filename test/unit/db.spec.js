'use strict'

const Database = require('../../app/db/Database')
const { expect } = require('chai')

describe('Database operations test', () => {
  let database = null

  describe('Database insert operation', () => {
    beforeEach(() => {
      database = new Database()
    })

    it('should insert new value to db', () => {
      const key = 'key'
      const value = 'value'

      database.set(key, value)

      expect(database.get(key)).equal(value)
    })

    it('should insert new value to db, and rewrite values', () => {
      const key = 'key'
      const value = 'value'
      const newValue = 'newValue'

      database.set(key, value)
      database.set(key, newValue)

      expect(database.get(key)).equal(newValue)
    })
  })

  describe('Database read operation', () => {
    const testedKey = 'testedKey'
    const testedValue = 'testedValue'

    beforeEach(() => {
      database = new Database()
      database.set(testedKey, testedValue)
    })

    it('should read from data db', () => {
      expect(database.get(testedKey)).equal(testedValue)
    })

    it('should return undefined, data by this key is not exists', () => {
      const nonexistenceKey = 'nonexistence'
      expect(database.get(nonexistenceKey)).equal(undefined)
    })
  })

  describe('Database delete operation', () => {
    const testedKey = 'testedKey'
    const testedValue = 'testedValue'

    beforeEach(() => {
      database = new Database()
      database.set(testedKey, testedValue)
    })

    it('should delete value by key and return true as result', () => {
      expect(database.delete(testedKey)).equal(true)
    })

    it('should return false, this key is not exists in database', () => {
      const nonexistenceKey = 'nonexistence'
      expect(database.delete(nonexistenceKey)).equal(false)
    })
  })
})
