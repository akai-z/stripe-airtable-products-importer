const routes = rootRequire('services/api/routes')
const got = require('got')

const routeName = 'access-token'
const httpMethod = 'post'

const requestOptions = {
  headers: { "content-type": "application/json" },
  responseType: 'json',
  resolveBodyOnly: true,
  body: {
    grant_type: 'client_credentials',
    audience: process.env.API_IDENTIFIER
  }
}

function setRoute(apiApp) {
  routes.setRoute(apiApp, httpMethod, routeName, routeHandler)
}

async function routeHandler(req, res) {
  const data = await requestAccessToken(
    req.body.client_id,
    req.body.client_secret
  )

  res.status(201).send(data)
}

async function requestAccessToken(clientId, clientSecret) {
  requestOptions.body.client_id = clientId
  requestOptions.body.client_secret = clientSecret
  requestOptions.body = JSON.stringify(requestOptions.body)

  try {
    const response = await got.post(
      `https://${process.env.API_DOMAIN}/oauth/token`,
      requestOptions
    )

    return response
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  setRoute
}
