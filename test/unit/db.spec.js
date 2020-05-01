'use strict'

const Database = require('../../app/db/Database')
const { expect } = require('chai')

describe('Database operations test', () => {
  let database = null

  describe('Database Insert operation', () => {
    beforeEach(() => {
      database = new Database()
    })

    it('insert to db', () => {
      const key = 'key'
      const value = 'value'

      database.set(key, value)

      expect(database.get(key)).equal(value)
    })

    it('insert to db, and rewrite values', () => {
      const key = 'key'
      const value = 'value'
      const newValue = 'newValue'

      database.set(key, value)
      database.set(key, newValue)

      expect(database.get(key)).equal(newValue)
    })
  })

  describe('Database Insert operation', () => {
    const testedKey = 'testedKey'
    const testedValue = 'testedValue'

    beforeEach(() => {
      database = new Database()
      database.set(testedKey, testedValue)
    })

    it('read from db', () => {
      expect(database.get(testedKey)).equal(testedValue)
    })

    it('insert to db, and rewrite values', () => {
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

    it('delete value from db', () => {
      expect(database.delete(testedKey)).equal(true)
    })

    it('try to delete nonexistence value', () => {
      const nonexistenceKey = 'nonexistence'
      expect(database.delete(nonexistenceKey)).equal(false)
    })
  })
})
