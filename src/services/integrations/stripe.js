const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY, stripeOptions)

function createProduct(product) {
  return stripe.products.create(product.data)
}

function product(productId) {
  return stripe.products.retrieve(productId)
}

function productsList(productIds) {
  return stripe.products.list({ "ids": productIds })
}

function updateProduct(product) {
  const data = product.updateData
  const id = data.id

  delete data['id']
  delete data['type']

  return stripe.products.update(id, data)
}

function createSku(sku) {
  return stripe.skus.create(sku.data)
}

function sku(skuId) {
  return stripe.skus.retrieve(skuId)
}

function skusList(skuIds) {
  return stripe.skus.list({ "ids": skuIds })
}

function updateSku(sku) {
  const data = sku.updateData
  const id = data.id
  delete data['id']

  return stripe.skus.update(id, data)
}

function stripeOptions() {
  const options = {}

  if (process.env.STRIPE_MAX_NETWORK_RETRIES) {
    options.maxNetworkRetries = process.env.STRIPE_MAX_NETWORK_RETRIES
  }

  if (process.env.STRIPE_TIMEOUT) {
    options.timeout = process.env.STRIPE_TIMEOUT
  }

  return options
}

module.exports = {
  createProduct,
  product,
  productsList,
  updateProduct,
  createSku,
  sku,
  skusList,
  updateSku
}
