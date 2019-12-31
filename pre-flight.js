require('dotenv').config();
const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');
const Parser = require('rss-parser');
const { URLSearchParams } = require('url');
const authUrl = "https://auth.meshydb.com/trae/connect/token";
const getUrl = "https://api.meshydb.com/trae/projections/social";
let parser = new Parser({
  customFields: {
    item: ['description', 'enclosure', 'comments']
  }
});

let params = fs.readFileSync('config/_default/params.toml', 'utf8');
const formData = new URLSearchParams();
formData.append('client_id', process.env.API_KEY);
formData.append('grant_type', 'password');
formData.append('username', 'api');
formData.append('password', process.env.API_PASSWORD);
formData.append('scope', 'meshy.api offline_access');  

const fetchIt = async () => {
  const tokenData = await fetch(authUrl, { method: 'POST', body: formData });
  const token = await tokenData.json();
  // console.log(token);

  const respData = await fetch(getUrl + '/', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token.access_token
    }
  });

  const resp = await respData.json();
  // console.log(resp);
  return resp;
};

fetchIt().then( resp => {
  const twitter = resp.results[0].twitter[0];
  const goodreads = resp.results[0].goodreads[0];
  const links = resp.results[0].links[0];
  goodreads.totalRead = resp.results[0].counts[0].goodreads;
  const music = resp.results[0].music[0].artists;

  const twitterParams = `
[newtweet]
  post = '''${twitter.post}'''
  id = "${twitter.atID}"
  link = "${twitter.link}"
  date = "${twitter.date}"
`;
  const goodreadsParams = `[latestRead]
  title = '''${goodreads.title}'''
  author = '''${goodreads.author}'''
  link = "${goodreads.link}"
  rating = ${goodreads.rating}
  review = '''${goodreads.review}'''
  image = '''${goodreads.image}'''
  total = ${goodreads.totalRead}
  date = "${goodreads.date}"
`;
  const linkParams = `[qi]
  title = '''${links.title}'''
  description = '''${links.data}'''
  link = "${links.link}"
  date = "${links.date}"
  image = '''${links.imageLink}'''
  source = "${links.sourceLink}"
`;
  let musicParams = `[music]`;
  music.forEach(function(artist) {
    console.log(artist);
    musicParams = musicParams + `
  [[music.artist]]
    name = "${artist.artist}"
    link = '''${artist.link}'''
    plays = ${artist.plays}
    image = '''${artist.image}'''`
  });
  fs.appendFileSync('config/_default/params.toml', twitterParams + goodreadsParams + linkParams + musicParams, err => {
    throw new Error('IT DIDN\'T WORK!!');
  });
}).catch( error => {
  process.stdout.write('There was an error!');
});
