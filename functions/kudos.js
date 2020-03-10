require('dotenv').config()
const axios = require('axios').default
// const authUrl = "https://auth.meshydb.com/trae/connect/token"
// const postUrl = "https://api.meshydb.com/trae/meshes/"
const getUrl = "https://api.airtable.com/v0/appsrGcwdYD2QikLG/Kudos?filterByFormula=AND(SEARCH('{URLFILL}', {url}))"
const postUrl = "https://api.airtable.com/v0/appsrGcwdYD2QikLG/Kudos/"

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST" || event.queryStringParameters.key !== "7f2ababa423061c509f4923dd04b6cf1") {
    return {
      statusCode: 403,
      body: 'This is not the function you are looking for...'
    }
  }
  try {
    const postData = {
      url: event.queryStringParameters.url,
      kudo: 1
    }
    const updateData = {
      fields: {
        kudo: 1
      }
    }
    // const updateData = {
    //   "filter": `{ url : '${event.queryStringParameters.url}' }`,
    //   "update": "{ $inc: { kudo: 1 }}"
    // }
    // console.log(updateData)
    // console.log("EnVars: ", process.env.API_KEY, process.env.API_PASSWORD)

    // const formObject = {
    //   'client_id': process.env.API_KEY,
    //   'grant_type': 'password',
    //   'username': 'api',
    //   'password': process.env.API_PASSWORD,
    //   'scope': 'meshy.api offline_access'
    // }

    // const tokenData = await axios.post(authUrl, formObject)
    // const token = await tokenData.data.access_token
    // console.log(token)
    const getData = await axios.get(getUrl.replace('{URLFILL}', event.queryStringParameters.url), {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + process.env.AIRTABLE_TOKEN
      }
    })
    
    const kudo
    if (getData.data.records.length === 1) {
      updateData.fields.kudo = getData.data.records[0].fields.kudo + 1
      kudo = await axios.patch(postUrl + getData.data.records[0].id, updateData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.AIRTABLE_TOKEN
        }
      })
    } else {
      updateData.fields.url = (event.queryStringParameters.url + '/').replace('//', '/')
      kudo = await axios.post(postUrl + getData.data.records[0].id, updateData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.AIRTABLE_TOKEN
        }
      })
    }

    
    console.log(kudo.data)
    if (kudo.status === 200 || kudo.status === 201) {
      return {
        statusCode: 200,
        body: `Updated ${event.queryStringParameters.url} with a kudo!`
      }
    }
  }
  catch (error) {
    return {
      statusCode: 422,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error
      })
    }
  }
}
