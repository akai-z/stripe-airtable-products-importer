const airtable = require('airtable')
const jsonConfig = rootRequire('services/config/json')

const base = baseInit()
const table = base(process.env.AIRTABLE_TABLE)
const selectFields = 'airtable-fields'

function baseInit() {
  return new airtable({apiKey: process.env.AIRTABLE_API_KEY})
    .base(process.env.AIRTABLE_BASE)
}

function list(page) {
  return tableSelect().eachPage(page)
}

function recentList(page, timeFrom = null) {
  const timeFilter = recentListTimeFilter(timeFrom)
  return tableSelect(timeFilter).eachPage(page)
}

function tableSelect(filter = null) {
  const params = {}
  const fields = jsonConfig.data(selectFields)

  if (process.env.AIRTABLE_VIEW) {
    params.view = process.env.AIRTABLE_VIEW
  }

  if (fields) {
    params.fields = fields
  }

  if (filter) {
    params.filterByFormula = filter
  }

  return table.select(params)
}

function recentListTimeFilter(timeFrom = null) {
  if (!timeFrom) {
    const date = new Date()

    date.setSeconds(
      date.getSeconds() - process.env.AIRTABLE_RECENT_RECORDS_INTERVAL
    )

    timeFrom = date.toISOString()
  }

  const lastModifiedTimefilter = timeFromFilterFormula(
    process.env.AIRTABLE_LAST_MODIFIED_TIME_FIELD,
    timeFrom
  )
  const createdTimefilter = timeFromFilterFormula(
    process.env.AIRTABLE_CREATED_TIME_FIELD,
    timeFrom
  )

  return `OR(${lastModifiedTimefilter}, ${createdTimefilter})`
}

function timeFromFilterFormula(field, timeFrom) {
  return `IS_AFTER({${field}},'${timeFrom}')`
}

module.exports = {
  list,
  recentList
}
