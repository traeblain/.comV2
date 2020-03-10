require('dotenv').config();
const fetch = require('node-fetch');
// const moment = require('moment');
const fs = require('fs');
// const Parser = require('rss-parser');
// const { URLSearchParams } = require('url');
// const authUrl = "https://auth.meshydb.com/trae/connect/token";
// const getUrl = "https://api.meshydb.com/trae/projections/social";
// let parser = new Parser({
//   customFields: {
//     item: ['description', 'enclosure', 'comments']
//   }
// });

let params = fs.readFileSync('config/_default/params.toml', 'utf8');
// const formData = new URLSearchParams();
// formData.append('client_id', process.env.API_KEY);
// formData.append('grant_type', 'password');
// formData.append('username', 'api');
// formData.append('password', process.env.API_PASSWORD);
// formData.append('scope', 'meshy.api offline_access');  

const fetchIt = async () => {
  // const tokenData = await fetch(authUrl, { method: 'POST', body: formData });
  // const token = await tokenData.json();
  // console.log(token);
  const headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + process.env.AIRTABLE_TOKEN
  };

  const twitterData = await fetch("https://api.airtable.com/v0/appebUxXFSVVWw8wO/Tweets?maxRecords=1&sort[0][field]=Date&sort[0][direction]=desc", {
    method: 'GET',
    headers: headers
  });
  const twitterJSON = await twitterData.json();
  const bookData = await fetch("https://api.airtable.com/v0/appChKYhLC0uF7gPx/Books?maxRecords=100&sort[0][field]=Date&sort[0][direction]=desc&filterByFormula=IS_AFTER({Date}, DATETIME_PARSE('1 Jan 2020 00:00', 'D MMM YYYY HH:mm'))", {
    method: 'GET',
    headers: headers
  });
  const bookJSON = await bookData.json();
  const linkData = await fetch("https://api.airtable.com/v0/appSegmqnDPMPqaGu/Links?maxRecords=1&sort[0][field]=Date&sort[0][direction]=desc", {
    method: 'GET',
    headers: headers
  });
  const linkJSON = await linkData.json();
  const musicData = await fetch("https://api.airtable.com/v0/appWQ7mufpoNZv5cS/Music?sort[0][field]=plays&sort[0][direction]=desc", {
    method: 'GET',
    headers: headers
  });
  const musicJSON = await musicData.json();

  const resp = {
    twitter: twitterJSON.records[0].fields,
    goodreads: bookJSON.records[0].fields,
    links: linkJSON.records[0].fields,
    music: musicJSON.records
  };
  resp.goodreads.totalRead = bookJSON.records.length;
  

  // const resp = await respData.json();
  // console.log(resp);
  return resp;
};

fetchIt().then( resp => {
  // const twitter = resp.results[0].twitter[0];
  // const goodreads = resp.results[0].goodreads[0];
  // const links = resp.results[0].links[0];
  // goodreads.totalRead = (resp.results[0].counts.length > 0) ? resp.results[0].counts[0].goodreads : 0;
  // const music = resp.results[0].music[0].artists;

  const twitterParams = `
[newtweet]
  post = '''${resp.twitter.Tweet}'''
  id = "${resp.twitter.atID}"
  link = "${resp.twitter.Link}"
  date = "${resp.twitter.Date}"
`;
  const goodreadsParams = `[latestRead]
  title = '''${resp.goodreads.Title}'''
  author = '''${resp.goodreads.Author}'''
  link = "${resp.goodreads.Link}"
  rating = ${resp.goodreads.Rating}
  review = '''${resp.goodreads.Review}'''
  image = '''${resp.goodreads.Image}'''
  total = ${resp.goodreads.totalRead}
  date = "${resp.goodreads.Date}"
`;
  const linkParams = `[qi]
  title = '''${resp.links.Title}'''
  description = '''${resp.links.Data}'''
  link = "${resp.links.Link}"
  date = "${resp.links.Date}"
  image = '''${resp.links.ImageLink}'''
  source = "${resp.links.SourceLink}"
`;
  let musicParams = `[music]`;
  resp.music.forEach(function(artist) {
    // console.log(artist);
    musicParams = musicParams + `
  [[music.artist]]
    name = "${artist.fields.artist}"
    link = '''${artist.fields.link}'''
    plays = ${artist.fields.plays}
    image = '''${artist.fields.image}'''`
  });
  fs.appendFileSync('config/_default/params.toml', twitterParams + goodreadsParams + linkParams + musicParams, err => {
    throw new Error('IT DIDN\'T WORK!!');
  });
}).catch( error => {
  process.stdout.write('There was an error!');
});
