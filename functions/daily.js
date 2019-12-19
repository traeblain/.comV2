const { HUGO_VERSION } = process.env
const moment = require('moment')

const returnData = {
  hugoVersion: HUGO_VERSION,
  now: moment().format()
}

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(returnData)
  }
}