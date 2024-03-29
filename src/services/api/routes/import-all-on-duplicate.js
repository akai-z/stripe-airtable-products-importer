'use strict'

const routes = rootRequire('services/api/routes')

const routeName = 'import-all-on-duplicate'
const httpMethod = 'post'

let importService

function setRoute(apiApp, core, jwtCheck) {
  importService = core.importService
  routes.setRoute(apiApp, httpMethod, routeName, routeHandler, jwtCheck)
}

async function routeHandler(req, res) {
  routes.sendConfirmationMessage(res)

  routes.setStripeCurrency(req.body)
  await importService.addAllOnDuplicate()
}

module.exports = {
  setRoute
}
