'use strict'

const jsonConfig = rootRequire('services/config/json')

class AbstractModel {
  get data() {
    const data = {}

    Object.getOwnPropertyNames(this).forEach((property) => {
      data[property.replace('_', '')] = this[property]
    })

    return data
  }

  set data(data) {
    for (const item in data) {
      this[item] = data[item]
    }

    return this
  }

  get updateData() {
    const data = {}

    Object.getOwnPropertyNames(this).forEach((property) => {
      data[property.replace('_', '')] =
        typeof this[property] !== 'undefined' ? this[property] : null
    })

    return data
  }

  setMappedData(data, fieldsMapping) {
    for (const field in fieldsMapping) {
      this[field] = data[fieldsMapping[field]]
    }

    return this
  }

  fieldsMappingConfig(configFile) {
    const data = jsonConfig.data(configFile)

    if (!data) {
      throw new Error(`Stripe ${this.constructor.name} fields mapping is not configured.`)
    }

    return data
  }

  prefixedId(id, prefix) {
    return id && prefix && id.toString().indexOf(prefix) !== 0 ? prefix + id : id
  }

  replaceUndefinedValue(value, replacement = null) {
    return typeof value !== 'undefined' ? value : replacement
  }
}

module.exports = AbstractModel
