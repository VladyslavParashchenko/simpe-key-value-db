'use strict'

require('dotenv').config()
const path = require('path')
const DatabaseImporter = require('./db/DatabaseImporter')
const { AMQPService, LoggerService } = require('./Services')

const databaseConfig = {
  backupsPath: path.join(process.cwd(), 'backups')
}

const msgHandlers = {
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

new DatabaseImporter(databaseConfig).restoreDatabase(databaseConfig).then((db) => {
  db.set('fwf', 'test')
}).catch((e) => LoggerService.error('App exception: ', e))



// (async () => {
//   try {
//
//     // const sendMessage = await AMQPService.buildMessageSender('tasks')
//     // const inQueue = await AMQPService.listenQueue('tasks', ({ action, payload }) => {
//     //   const responsePayload = msgHandlers[action](payload, database);
//     //   sendMessage({
//     //     action,
//     //     payload: responsePayload
//     //   })
//     //     .then()
//     //     .catch((e) => LoggerService.error('Out queue exception: ', e))
//     // })
//   } catch (e) {
//     LoggerService.error('App exception: ', e)
//   }
// })()
