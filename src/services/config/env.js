const dotenv = require('dotenv')

function init() {
  const result = dotenv.config({ path: configPath('.env') })

  if (result.error) {
    throw result.error
  }
}

init()
