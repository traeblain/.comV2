require('dotenv').config()
const axios = require('axios').default
const { URLSearchParams } = require('url')
const authUrl = "https://auth.meshydb.com/trae/connect/token"
const postUrl = "https://api.meshydb.com/trae/meshes/"

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
      "filter": `{ url : '${event.queryStringParameters.url}' }`,
      "update": "{ $inc: { kudo: 1 }}"
    }
    console.log(updateData)
    console.log("EnVars: ", process.env.API_KEY, process.env.API_PASSWORD)

    const formData = new URLSearchParams()
    formData.append('client_id', process.env.API_KEY)
    formData.append('grant_type', 'password')
    formData.append('username', 'api')
    formData.append('password', process.env.API_PASSWORD)
    formData.append('scope', 'meshy.api offline_access')
    console.log(formData)

    const tokenData = await axios.post(authUrl, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const token = await tokenData.data.access_token
    console.log(token)

    const update = await axios.patch(postUrl + 'kudos/', updateData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    console.log(update.data)
    if (update.data.matchedCount === 1) {
      return {
        statusCode: 200,
        body: `Updated ${event.queryStringParameters.url} with a kudo!`
      }
    } else {
      const resp = await axios.post(postUrl + 'kudos/', postData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })

      console.log(JSON.stringify(resp.data));
      return {
        statusCode: 200,
        body: `Created record and added ${event.queryStringParameters.url} with a kudo!`
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
