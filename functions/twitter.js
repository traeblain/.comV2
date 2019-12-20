require('dotenv').config()
const axios = require('axios').default
const moment = require('moment')
const { URLSearchParams } = require('url')
const md5 = require('js-md5');
const authUrl = "https://auth.meshydb.com/trae/connect/token"
const postUrl = "https://api.meshydb.com/trae/meshes/"

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST" || event.queryStringParameters.secret !== process.env.POST_SECRET) {
    return {
      statusCode: 403,
      body: 'This is not the function you are looking for...'
    }
  }
  try {
    const data = JSON.parse(event.body)
    const postData = {
      '_id': md5(data.link),
      'stringdate': data.date,
      'atID': "@" + data.user,
      'post': data.text,
      'link': data.link,
      'site': 'twitter',
      'date': moment(data.date, "MMMM DD, YYYY at hh:mma").format()
    }

    const formData = new URLSearchParams()
    formData.append('client_id', process.env.API_KEY)
    formData.append('grant_type', 'password')
    formData.append('username', 'api')
    formData.append('password', process.env.API_PASSWORD)
    formData.append('scope', 'meshy.api offline_access')

    const tokenData = await axios.post(authUrl, formData)
    const token = await tokenData.data.access_token
    // console.log(token)

    const resp = await axios.post(postUrl + 'social/', postData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })

    //console.log(JSON.stringify(resp.data));
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resp.data)
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
