'use strict'

function setRoute(apiApp, method, routeName, handler, jwtCheck = null) {
  if (jwtCheck) {
    apiApp[method](process.env.API_BASE_PATH + routeName, jwtCheck, handler)
    return
  }

  apiApp[method](process.env.API_BASE_PATH + routeName, handler)
}

function setStripeCurrency(reqParams) {
  if (reqParams.stripe_currency) {
    process.env.STRIPE_CURRENCY = reqParams.stripe_currency
  }
}

function sendConfirmationMessage(res) {
  res.status(201).send('Import request has been submitted.')
}

module.exports = {
  setRoute,
  setStripeCurrency,
  sendConfirmationMessage
}
