const { HUGO_VERSION } = process.env

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: HUGO_VERSION
  }
}