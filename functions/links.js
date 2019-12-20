require('dotenv').config()
const axios = require('axios').default
const moment = require('moment')
const { URLSearchParams } = require('url')
const Parser = require('rss-parser')
let parser = new Parser({
  customFields: {
    item: ['description', 'enclosure', 'comments']
  }
})
const authUrl = "https://auth.meshydb.com/trae/connect/token"
const postUrl = "https://api.meshydb.com/trae/meshes/"


exports.handler = async (event, context) => {
  try {
    const postData = {
      site: 'links'
    }
    const feed = await parser.parseURL('https://refind.com/traeblain.rss')
    const latest = feed.items[0]
    postData.guid = latest.guid
    postData.stringdate = moment(latest.pubDate).format('MMM DD')
    postData.date = moment(latest.pubDate).format()
    postData.title = latest.title
    postData.link = latest.link
    postData.data = latest.description
    postData.imageLink = latest.enclosure.url
    postData.sourceLink = latest.comments

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
      body: JSON.stringify(resp.data)
    }
  }
  catch (error) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: error
      })
    }
  }
}
