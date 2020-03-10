require('dotenv').config()
const axios = require('axios').default
const moment = require('moment')
const postUrl = "https://api.airtable.com/v0/appebUxXFSVVWw8wO/Tweets"

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST" || event.queryStringParameters.secret !== process.env.POST_SECRET) {
    return {
      statusCode: 403,
      body: 'This is not the function you are looking for...'
    }
  }
  try {
    const data = JSON.parse(event.body)
    console.log(data)
    const postData = {
      'fields': {
        'ID': data.link.split('/').reverse()[0],
        'atID': "@" + data.user,
        'Tweet': data.text,
        'Link': data.link,
        'Date': moment(data.date, "MMMM DD, YYYY at hh:mma").format()
      }
    }
    console.log(postData)

    const resp = await axios.post(postUrl, postData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.AIRTABLE_TOKEN
      }
    })

    console.log(resp.status, resp.statusText, resp.data)
    if (resp.status === 200 || resp.status === 201) {
      console.log('Attempting to rebuild.')
      const rebuild = await axios.post('https://api.netlify.com/build_hooks/' + process.env.REBUILD_KEY, {})
    }
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
