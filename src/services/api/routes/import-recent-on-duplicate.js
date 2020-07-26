const routes = rootRequire('services/api/routes')

const routeName = 'import-recent-on-duplicate'
const httpMethod = 'post'

let importService

function setRoute(apiApp, core, jwtCheck) {
  importService = core.importService
  routes.setRoute(apiApp, httpMethod, routeName, routeHandler, jwtCheck)
}

function routeHandler(req, res) {
  routes.sendConfirmationMessage(res)

  routes.setStripeCurrency(req.body)
  importService.addRecentOnDuplicate()
}

module.exports = {
  setRoute
}
