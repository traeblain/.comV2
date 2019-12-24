require('dotenv').config()
const axios = require('axios').default
const moment = require('moment')
const md5 = require('js-md5');
const Parser = require('rss-parser')
let parser = new Parser({
  customFields: {
    item: ['description', 'enclosure', 'comments']
  }
})
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
    const postData = {
      site: 'links'
    }
    const feed = await parser.parseURL('https://refind.com/traeblain.rss')
    const latest = feed.items[0]
    postData['_id'] = md5(latest.guid)
    postData.guid = latest.guid
    postData.stringdate = moment(latest.pubDate).format('MMM DD')
    postData.date = moment(latest.pubDate).format()
    postData.title = latest.title
    postData.link = latest.link
    postData.data = latest.description
    postData.imageLink = latest.enclosure.url
    postData.sourceLink = latest.comments

    const formData = {
      'client_id': process.env.API_KEY,
      'grant_type': 'password',
      'username': 'api',
      'password': process.env.API_PASSWORD,
      'scope': 'meshy.api offline_access'
    }

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

    // console.log(resp.status, resp.statusText)
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