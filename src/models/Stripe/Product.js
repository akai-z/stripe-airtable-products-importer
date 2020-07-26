const AbstractModel = rootRequire('models/AbstractModel')

const airtableFieldsMapping = 'stripe-airtable-product-fields-mapping'

class Product extends AbstractModel {
  constructor() {
    super()

    this._attributes = ['name']
    this._type = process.env.STRIPE_PRODUCT_TYPE
  }

  get id() {
    return this._id
  }

  set id(id) {
    this._id = this.prefixedId(id, process.env.STRIPE_PRODUCT_ID_PREFIX)
  }

  get name() {
    return this._name
  }

  set name(name) {
    this._name = name
  }

  get description() {
    return this._description
  }

  set description(description) {
    this._description = description
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

  get type() {
    return this._type
  }

  set type(type) {
    this._type = type
  }

  setMappedData(data) {
    return super.setMappedData(
      data,
      this.fieldsMappingConfig(airtableFieldsMapping)
    )
  }
}

module.exports = Product
