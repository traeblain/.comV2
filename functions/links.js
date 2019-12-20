require('dotenv').config()
const fetch = require('node-fetch')
const moment = require('moment')
const { URLSearchParams } = require('url')
const authUrl = "https://auth.meshydb.com/trae/connect/token"
const postUrl = "https://api.meshydb.com/trae/meshes/"
const Parser = require('rss-parser')
let parser = new Parser({
  customFields: {
    item: ['description', 'enclosure', 'comments']
  }
})

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

    const tokenData = await fetch(authUrl, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    })
    const token = await tokenData.json()
    console.log(JSON.stringify(token))

    const respData = await fetch(postUrl + 'social/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.access_token
      },
      body: JSON.stringify(postData)
    })

    const resp = await respData.json()
    console.log(JSON.stringify(resp));
    return {
      statusCode: 200,
      body: JSON.stringify(resp)
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
