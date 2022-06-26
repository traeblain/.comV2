require('dotenv').config()
const axios = require('axios').default
const moment = require('moment')
const Parser = require('rss-parser')
let parser = new Parser({
  customFields: {
    item: ['description', 'enclosure', 'comments', 'updated', 'media:content']
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
    const feed = await parser.parseURL('https://feedly.com/f/rTXjCeF8JMcEjFevoSmC4j4R')
    const latest = feed.items[0]
    postData.ID = latest.id
    postData.Date = moment(latest.updated).format()
    postData.Title = latest.title
    postData.Link = latest.link
    postData.Data = latest.summary
    postData.ImageLink = latest['media:content'].$.url
    postData.SourceLink = 'https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Ffeedly.com%2Ff%2FrTXjCeF8JMcEjFevoSmC4j4R'

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
