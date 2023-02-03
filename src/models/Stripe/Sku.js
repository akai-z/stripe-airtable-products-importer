'use strict'

const AbstractModel = rootRequire('models/AbstractModel')

const airtableFieldsMapping = 'stripe-airtable-sku-fields-mapping'

class Sku extends AbstractModel {
  constructor() {
    super()

    this._currency = process.env.STRIPE_CURRENCY
    this._inventory = { type: process.env.STRIPE_SKU_DEFAULT_INVENTORY_TYPE }
  }

  get id() {
    return this._id
  }

  set id(id) {
    this._id = this.prefixedId(id, process.env.STRIPE_SKU_ID_PREFIX)
  }

  get attributes() {
    if (!this._attributes.includes('name')) {
      this._attributes.push('name')
    }

    return this._attributes
  }

  set attributes(attributes) {
    this._attributes = attributes
  }

  get currency() {
    return this._currency
  }

  set currency(currency) {
    this._currency = currency
  }

  get price() {
    return this._price
  }

  set price(price) {
    this._price = price * 100
  }

  get inventory() {
    if (!this._inventory['type']) {
      this._inventory.type = process.env.STRIPE_SKU_DEFAULT_INVENTORY
    }

    return this._inventory
  }

  set inventory(inventory) {
    this._inventory = inventory
  }

  get product() {
    return this._product
  }

  set product(product) {
    this._product = this.prefixedId(product, process.env.STRIPE_PRODUCT_ID_PREFIX)
  }

  get image() {
    return this._image
  }

  set image(image) {
    this._image = image
  }

  setMappedData(data) {
    return super.setMappedData(data, this.fieldsMappingConfig(airtableFieldsMapping))
  }
}

module.exports = Sku
