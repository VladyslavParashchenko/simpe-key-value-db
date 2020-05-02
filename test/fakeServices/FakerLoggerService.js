'use strict'

module.exports = {
  info: (...params) => {},
  error: (...params) => {
    console.log(params)
  }
}
