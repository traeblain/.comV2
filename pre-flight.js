require('dotenv').config()
//const fetch = require('node-fetch');
const fetch = require('node-fetch-with-proxy')
// const moment = require('moment');
const fs = require('fs')

let params = fs.readFileSync('config/_default/params.toml', 'utf8')

const fetchIt = async () => {
  const headers = {
    Accept: 'application/json',
    Authorization: 'Bearer ' + process.env.AIRTABLE_TOKEN,
  }

  const options = {
    method: 'GET',
    headers: headers,
  }

  const twitterData = await fetch(
    'https://api.airtable.com/v0/appebUxXFSVVWw8wO/Tweets?maxRecords=1&sort[0][field]=Date&sort[0][direction]=desc',
    options
  )
  const twitterJSON = await twitterData.json()
  process.stdout.write('Twitter fetched\n')
  const bookData = await fetch(
    "https://api.airtable.com/v0/appChKYhLC0uF7gPx/Books?maxRecords=100&sort[0][field]=Date&sort[0][direction]=desc&filterByFormula=IS_AFTER({Date}, DATETIME_PARSE('1 Jan 2020 00:00', 'D MMM YYYY HH:mm'))",
    options
  )
  const bookJSON = await bookData.json()
  process.stdout.write('Books fetched\n')
  const linkData = await fetch(
    'https://api.airtable.com/v0/appSegmqnDPMPqaGu/Links?maxRecords=1&sort[0][field]=Date&sort[0][direction]=desc',
    options
  )
  const linkJSON = await linkData.json()
  process.stdout.write('Link fetched\n')
  const musicData = await fetch(
    'https://api.airtable.com/v0/appWQ7mufpoNZv5cS/Music?sort[0][field]=plays&sort[0][direction]=desc',
    options
  )
  const musicJSON = await musicData.json()
  process.stdout.write('Music fetched\n')
  const gameData = await fetch('https://automate.blain.io/latest-game/')
  const gameJSON = await gameData.json()
  process.stdout.write('Game fetched\n')

  const resp = {
    twitter: twitterJSON.records[0].fields,
    goodreads: bookJSON.records[0].fields,
    links: linkJSON.records[0].fields,
    music: musicJSON.records,
    game: gameJSON,
  }
  resp.goodreads.totalRead = bookJSON.records.length

  console.log(resp)
  return resp
}

fetchIt()
  .then((resp) => {
    const twitterParams = `
[newtweet]
  post = '''${resp.twitter.Tweet}'''
  id = "${resp.twitter.atID}"
  link = "${resp.twitter.Link}"
  date = "${resp.twitter.Date}"
`
    const goodreadsParams = `[latestRead]
  title = '''${resp.goodreads.Title}'''
  author = '''${resp.goodreads.Author}'''
  link = "${resp.goodreads.Link}"
  rating = ${resp.goodreads.Rating}
  review = '''${resp.goodreads.Review}'''
  image = '''${resp.goodreads.Image}'''
  total = ${resp.goodreads.totalRead}
  date = "${resp.goodreads.Date}"
`
    const linkParams = `[qi]
  title = '''${resp.links.Title}'''
  description = '''${resp.links.Data}'''
  link = "${resp.links.Link}"
  date = "${resp.links.Date}"
  image = '''${resp.links.ImageLink}'''
  source = "${resp.links.SourceLink}"
`
    let musicParams = `[music]`
    resp.music.forEach(function (artist) {
      // console.log(artist);
      musicParams =
        musicParams +
        `
  [[music.artist]]
    name = "${artist.fields.artist}"
    link = '''${artist.fields.link}'''
    plays = ${artist.fields.plays}
    image = '''${artist.fields.image}'''
`
    })
    let artwork = ''
    // if (resp.game.artwork[0].artworks) {
    //   artwork = resp.game.artwork[0].artworks[0].url
    // } else {
    //   artwork = resp.game.artwork[0].screenshots[0].url
    // }
    let gameParams = `[game]
  title = '''${resp.game.game.Game}'''
  hrs = ${resp.game.game['Hours Played']}
  lastplayed = ${resp.game.game['Last Played']}
  artwork = "${resp.game.artwork.replace('t_thumb', 't_screenshot_huge')}"
  `
    // cover = "${resp.game.artwork[0].cover.url.replace('t_thumb', 't_720p')}"
    fs.appendFileSync(
      'config/_default/params.toml',
      twitterParams + goodreadsParams + linkParams + musicParams + gameParams,
      (err) => {
        throw new Error("IT DIDN'T WORK!!")
      }
    )
  })
  .catch((error) => {
    process.stdout.write(error)
  })
