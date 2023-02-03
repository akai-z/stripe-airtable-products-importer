'use strict'

const airtable = rootRequire('services/integrations/airtable')
const stripe = rootRequire('services/integrations/stripe')
const StripeProductModel = rootRequire('models/Stripe/Product')
const StripeSkuModel = rootRequire('models/Stripe/Sku')

async function addAll() {
  try {
    await airtable.list(addAirtableListToStripe)
  } catch (err) {
    console.log(err)
  }
}

async function addAllOnDuplicate() {
  try {
    console.log('Import process has started')
    await airtable.list(addAirtableListToStripeOnDuplicate)
    console.log('Import process is done')
  } catch (err) {
    console.log(err)
  }
}

async function addRecent() {
  try {
    await airtable.recentList(addAirtableListToStripe)
  } catch (err) {
    console.log(err)
  }
}

async function addRecentOnDuplicate() {
  try {
    await airtable.recentList(addAirtableListToStripeOnDuplicate)
  } catch (err) {
    console.log(err)
  }
}

async function addAirtableListToStripe(records, fetchNextPage) {
  const { products, skus } = stripeAirtableRecordsData(records)

  for (const productId in products) {
    skus[productId].attributes = { name: products[productId].data.name }

    await stripe.createProduct(products[productId])
    await stripe.createSku(skus[productId])
  }

  fetchNextPage()
}

async function addAirtableListToStripeOnDuplicate(records, fetchNextPage) {
  const data = stripeAirtableRecordsData(records)
  const newProducts = { ...data.products }
  const newSkus = { ...data.skus }

  for await (const stripeProduct of stripe.productsList(data.productIds)) {
    const productId = stripeProduct.id.replace(process.env.STRIPE_PRODUCT_ID_PREFIX, '')

    delete newProducts[productId]

    if (!data.products[productId]) {
      await stripe.createProduct(data.products[productId])
      continue
    }

    if (isStripeDataUpdatable(stripeProduct, data.products[productId])) {
      await stripe.updateProduct(data.products[productId])
    }
  }

  for (const newProductId in newProducts) {
    await stripe.createProduct(newProducts[newProductId])
  }

  for await (const stripeSku of stripe.skusList(data.skuIds)) {
    const skuId = stripeSku.id.replace(process.env.STRIPE_SKU_ID_PREFIX, '')

    delete newSkus[skuId]

    if (!data.skus[skuId]) {
      data.skus[skuId].attributes = {
        name: data.products[skuId].data.name
      }

      await stripe.createSku(data.skus[skuId])
      continue
    }

    if (
      isStripeDataUpdatable(stripeSku, data.skus[skuId].data) ||
      stripeSku.attributes.name != data.products[skuId].data.name
    ) {
      data.skus[skuId].attributes = {
        name: data.products[skuId].data.name
      }

      await stripe.updateSku(data.skus[skuId])
    }
  }

  for (const newSkuId in newSkus) {
    newSkus[newSkuId].attributes = { name: data.products[newSkuId].data.name }
    await stripe.createSku(newSkus[newSkuId])
  }

  fetchNextPage()
}

function stripeAirtableRecordsData(records) {
  const data = {
    products: {},
    skus: {},
    productIds: [],
    skuIds: []
  }

  records.forEach((record) => {
    const productId = [process.env.STRIPE_PRODUCT_ID_PREFIX, record.fields.productId].join('')
    const skuId = [process.env.STRIPE_SKU_ID_PREFIX, record.fields.productId].join('')

    data.productIds.push(productId)
    data.skuIds.push(skuId)

    data.products[record.fields.productId] = new StripeProductModel().setMappedData(record.fields)
    data.skus[record.fields.productId] = new StripeSkuModel().setMappedData(record.fields)
  })

  return data
}

function isStripeDataUpdatable(originalData, newData) {
  for (let field in newData) {
    field = field.replace('_', '')

    if (['attributes', 'inventory'].includes(field)) {
      continue
    }

    if (originalData[field] != newData[field]) {
      return true
    }
  }

  return false
}

module.exports = {
  addAll,
  addAllOnDuplicate,
  addRecent,
  addRecentOnDuplicate
}
