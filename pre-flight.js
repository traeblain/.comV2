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
formData.append('client_id', 'update');
formData.append('grant_type', 'password');
formData.append('username', 'api');
formData.append('password', 'update');
formData.append('scope', 'meshy.api offline_access');  

const fetchIt = async () => {
  const tokenData = await fetch(authUrl, { method: 'POST', body: formData });
  const token = await tokenData.json();

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
  image = '''${goodreads.imageLink}'''
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
  fs.appendFileSync('config/_default/params.toml', twitterParams + goodreadsParams + linkParams, err => {
    throw new Error('IT DIDN\'T WORK!!');
  });
}).catch( error => {
  process.stdout.write('There was an error!');
});
