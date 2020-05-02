'use strict'

class Database {
  constructor () {
    this.storage = new Map()
  }

  set (key, value) {
    this.storage.set(key, value)
  }

  get (key) {
    return this.storage.get(key)
  }

  delete (key) {
    return this.storage.delete(key)
  }

  getDatabaseByChunk () {
    return Array.from(this.storage.entries()).reduce((acc, [key, value]) => {
      if (Object.keys(acc[acc.length - 1]).length === Database.MAX_CHUNK_ELEMENT_COUNT) {
        acc.push({})
      }

      acc[acc.length - 1][key] = value
      return acc
    }, [{}])
  }
}

Database.MAX_CHUNK_ELEMENT_COUNT = 100

module.exports = Database
