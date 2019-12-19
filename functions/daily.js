const { HUGO_VERSION } = process.env
const moment = require('moment')

exports.handler = async (event, context) => {
  const returnData = {
      hugoVersion: HUGO_VERSION,
      now: moment().format()
      //now: new Date().toString()
    }
  return {
    statusCode: 200,
    body: JSON.stringify(returnData)
  }
}