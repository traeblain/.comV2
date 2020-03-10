require('dotenv').config()
const axios = require('axios').default
// const moment = require('moment')
// const authUrl = "https://auth.meshydb.com/trae/connect/token"
// const postUrl = "https://api.meshydb.com/trae/meshes/"
const postUrl = "https://api.airtable.com/v0/appWQ7mufpoNZv5cS/Music"

exports.handler = async (event, context) => {
  try {
    const artistsResponse = await axios.get('https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=tblain&api_key=b25b959554ed76058ac220b7b2e0a026&period=6month&format=json')
    const artists = artistsResponse.data.topartists.artist

    const recordIDs = [
      'reczI5d71Z6R0WbO7', 'reckIC9zsR8zbMQsl', 'recgKX1wo85XuCpG8', 'recxFKcQPDXxq5O0z', 'rec6lEV1TOLmHXlxf'
    ]

    const cleanArtists = []
    let artistData
    for (let i = 0; i < 5; i++) {
      artistData = await axios.get('https://webservice.fanart.tv/v3/music/' + artists[i].mbid + '&?api_key=06f56465de874e4c75a2e9f0cc284fa3&format=json')

      cleanArtists[i] = {
        id: recordIDs[i],
        fields: {
          link: artists[i].url,
          plays: artists[i].playcount * 1,
          artist: "#" + artists[i].name,
          image: artists[i].image[3]['#text']
        }
      }

      if (typeof artistData.data.artistthumb !== 'undefined') {
        cleanArtists[i].fields.image = artistData.data.artistthumb[0].url
      }
      
    }
    
    const postData = {
      // site: 'music',
      records: cleanArtists
    }
    // console.log(postData)

    // const formData = {
    //   'client_id': process.env.API_KEY,
    //   'grant_type': 'password',
    //   'username': 'api',
    //   'password': process.env.API_PASSWORD,
    //   'scope': 'meshy.api offline_access'
    // }

    // const tokenData = await axios.post(authUrl, formData)
    // const token = await tokenData.data.access_token
    // console.log(token)

    const resp = await axios.put(postUrl, postData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.AIRTABLE_TOKEN
      }
    })

    console.log(resp.status, resp.statusText)
    if (resp.status === 200 || resp.status === 201) {
      console.log('Attempting to rebuild.')
      // const rebuild = await axios.post('https://api.netlify.com/build_hooks/' + process.env.REBUILD_KEY, {})
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
      body: JSON.stringify({ error: error })
    }
  }
}
