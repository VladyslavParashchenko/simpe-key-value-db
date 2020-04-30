'use strict'

const amqplib = require('amqplib')

function instantiateService (serviceConfig = {}) {

  const { connectionUrl } = serviceConfig

  return {
    async listenQueue (queueName, callback) {
      amqplib.connect(connectionUrl).then(function (ch) {
        return ch.assertQueue(queueName).then(function (ok) {
          return ch.consume(queueName, function (msg) {
            if (msg !== null) {
              callback(JSON.parse(msg))
              ch.ack(msg)
            }
          })
        })
      })
    },

    async buildMessageSender (queueName) {
      amqplib.connect(connectionUrl).then(function (conn) {
        return conn.createChannel()
      }).then(function (ch) {
        return ch.assertQueue(queueName).then(function (ok) {
          return (msgObj) => {
            ch.sendToQueue(queueName, Buffer.from(JSON.stringify(msgObj)))
          }
        })
      })
    }
  }
}


module.exports = { instantiateService }
