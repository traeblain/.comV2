require('dotenv').config()
const axios = require('axios').default
const moment = require('moment')
const Parser = require('rss-parser')
let parser = new Parser({
  customFields: {
    item: ['description', 'enclosure', 'comments']
  }
})
const postUrl = "https://api.airtable.com/v0/appSegmqnDPMPqaGu/Links"


exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST" || event.queryStringParameters.secret !== process.env.POST_SECRET) {
    return {
      statusCode: 403,
      body: 'This is not the function you are looking for...'
    }
  }
  try {
    const postData = {}
    const feed = await parser.parseURL('https://refind.com/traeblain.rss')
    const latest = feed.items[0]
    postData.ID = latest.guid
    postData.Date = moment(latest.pubDate).format()
    postData.Title = latest.title
    postData.Link = latest.link
    postData.Data = latest.description
    postData.ImageLink = latest.enclosure.url
    postData.SourceLink = latest.comments

    const resp = await axios.post(postUrl, { fields: postData }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.AIRTABLE_TOKEN
      }
    })

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
