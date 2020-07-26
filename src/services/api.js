const express = require('express')
const apiApp = express()
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const rateLimit = require('express-rate-limit')
const fs = require('fs')

function run(core) {
  setBodyParser()
  setRateLimit()
  setRoutes(core)
  setDefaultResponseMessages()

  apiApp.listen(process.env.API_PORT)
}

function setBodyParser() {
  apiApp.use(express.json())
  apiApp.use(express.urlencoded({ extended: true }))
}

function setRateLimit() {
  const rateLimiter = rateLimit({
    windowMs: process.env.API_RATE_LIMIT_TIMEOUT * 1000,
    max: process.env.API_RATE_LIMIT_MAX_REQUESTS
  })

  apiApp.use(rateLimiter)
}

function setRoutes(core) {
  const jwtCheck = checkJwt()

  fs.readdirSync(srcPath('services/api/routes')).forEach(route => {
    rootRequire(`services/api/routes/${route}`).setRoute(apiApp, core, jwtCheck)
  })
}

function checkJwt() {
  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.API_DOMAIN}/.well-known/jwks.json`
    }),
    audience: process.env.API_IDENTIFIER,
    issuer: `https://${process.env.API_DOMAIN}/`,
    algorithms: ['RS256']
  })
}

function setDefaultResponseMessages() {
  apiApp.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Invalid token.')
    }
  })
}

module.exports = {
  run
}
