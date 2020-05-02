'use strict'

require('dotenv').config()
const Database = require('./db')
const { AMQPService, LoggerService } = require('./Services').getAppServices()
const messageHandlers = require('./messageHandlers')

async function startApp (appConfig = {}) {
  const database = await Database.restoreDatabase(appConfig)
  try {
    const sendMessage = await AMQPService.buildMessageSender(process.env.OUTCOME_QUEUE)
    await AMQPService.listenQueue(process.env.INCOME_QUEUE, ({ action, payload }) => {
      const responsePayload = messageHandlers[action](payload, database)
      sendMessage({
        action,
        payload: responsePayload
      })
    })
  } catch (e) {
    LoggerService.error('App error', e)
  }
}

module.exports = { startApp }
