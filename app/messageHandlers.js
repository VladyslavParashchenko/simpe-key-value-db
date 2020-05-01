'use strict'

module.exports = {
  SET: ({ key, value }, db) => {
    db.set(key, value)

    return {
      key,
      value
    }
  },
  GET: ({ key }, db) => {
    db.get(key)
    return db.get(key)
  },
  DELETE: ({ key }, db) => {
    const { value } = db.get(key)
    db.delete(key)

    return {
      key,
      value
    }
  }
}
