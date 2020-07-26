setGlobals()
rootRequire('services/config/env')
exports.importService = rootRequire('services/import')

function setGlobals() {
  const path = require('path')
  const rootPath = '/' + path.basename(path.dirname(__dirname))

  global.rootRequire = name => require(`${__dirname}/${name}`)
  global.srcPath = file => `${__dirname}/${file}`
  global.configPath = file => `${rootPath}/config/${file}`
}
