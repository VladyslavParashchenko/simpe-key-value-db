'use strict'

const { startApp } = require('./app')

const path = require('path')
const appConfig = { backupsPath: path.join(process.cwd(), 'backups') }

startApp(appConfig).catch(e => {
  console.log(e.stack)
  process.exit()
})
