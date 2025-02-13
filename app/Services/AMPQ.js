'use strict'

const amqplib = require('amqplib')

function instantiateService (serviceConfig = {}) {
  const { connectionUrl } = serviceConfig

  return {
    async listenQueue (queueName, callback) {
      const conn = await amqplib.connect(connectionUrl)
      const ch = await conn.createChannel()
      await ch.assertQueue(queueName)
      return ch.consume(queueName, function (msg) {
        if (msg !== null) {
          callback(JSON.parse(msg.content.toString()))
          ch.ack(msg)
        }
      })
    },

    async buildMessageSender (queueName) {
      const conn = await amqplib.connect(connectionUrl)
      const ch = await conn.createChannel()
      await ch.assertQueue(queueName)

      return (msgObj) => {
        ch.sendToQueue(queueName, Buffer.from(JSON.stringify(msgObj)))
      }
    }
  }
}

module.exports = { instantiateService }
