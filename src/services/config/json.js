'use strict'

const fs = require('fs')

function data(file) {
  const path = configPath(`json/${file}.json`)

  if (!fs.existsSync(path)) {
    throw new Error(`Could not find JSON config file "${file}.json".`)
  }

  const data = fs.readFileSync(path)
  const jsonData = JSON.parse(data)

  if (!jsonData) {
    throw new Error(`Could not parse JSON config file "${file}.json".`)
  }

  return jsonData
}

module.exports = {
  data
}
