// Cool Background
// if (document.querySelector("canvas")) {
var canvas, ctx, color, mono, xloc, yloc, xsize, ysize, mousePosition
function sizeCanvas(img) {
  // console.log(img)
  if (typeof img !== 'string') {
    img = 'https://res.cloudinary.com/dixwznarl/image/upload/tbcom/tbmonogram.svg'
  }
  canvas = document.querySelector('canvas')
  ctx = canvas.getContext('2d')
  color = '#111'
  canvas.width = document.getElementById('particles').offsetWidth
  canvas.height = document.getElementById('particles').offsetHeight
  canvas.style.display = 'block'
  ctx.fillStyle = '#c8c8c8'
  ctx.lineWidth = 0.1
  ctx.strokeStyle = color
  mono = new Image()
  mono.src = img
  xloc = canvas.width / 2 - 125
  yloc = canvas.height / 2 - 125
  xsize = 250
  ysize = 250
  mousePosition = {
    x: canvas.width / 2,
    y: canvas.height / 2
  }
}

var moveDir = [20, 8]

function fakemovement() {
  if (mousePosition.x < 0 || mousePosition.x > canvas.width) {
    moveDir[0] = -moveDir[0]
  } else if (mousePosition.y < 0 || mousePosition.y > canvas.height) {
    moveDir[1] = -moveDir[1]
  }
  mousePosition.x += moveDir[0]
  mousePosition.y += moveDir[1]
}

var dots = {
  nb: 175,
  distance: 100,
  d_radius: 250,
  array: []
}

if (window.innerWidth <= 760) {
  dots.nb = 50
}

function Dot() {
  this.x = Math.random() * canvas.width
  this.y = Math.random() * canvas.height

  this.vx = -0.5 + Math.random()
  this.vy = -0.5 + Math.random()

  this.radius = 2 * Math.random()
}

Dot.prototype = {
  create: function() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fill()
  },

  animate: function() {
    for (var i = 0; i < dots.nb; i++) {
      var dot = dots.array[i]

      if (dot.y < 0 || dot.y > canvas.height) {
        dot.vx = dot.vx
        dot.vy = -dot.vy
      } else if (dot.x < 0 || dot.x > canvas.width) {
        dot.vx = -dot.vx
        dot.vy = dot.vy
      }
      dot.x += dot.vx
      dot.y += dot.vy
    }
  },

  line: function() {
    for (var i = 0; i < dots.nb; i++) {
      for (var j = 0; j < dots.nb; j++) {
        var i_dot = dots.array[i]
        var j_dot = dots.array[j]

        if (
          i_dot.x - j_dot.x < dots.distance &&
          i_dot.y - j_dot.y < dots.distance &&
          i_dot.x - j_dot.x > -dots.distance &&
          i_dot.y - j_dot.y > -dots.distance
        ) {
          if (
            i_dot.x - mousePosition.x < dots.d_radius &&
            i_dot.y - mousePosition.y < dots.d_radius &&
            i_dot.x - mousePosition.x > -dots.d_radius &&
            i_dot.y - mousePosition.y > -dots.d_radius
          ) {
            ctx.beginPath()
            ctx.moveTo(i_dot.x, i_dot.y)
            ctx.lineTo(j_dot.x, j_dot.y)
            ctx.stroke()
            ctx.closePath()
          }
        }
      }
    }
  }
}

function createDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (var i = 0; i < dots.nb; i++) {
    dots.array.push(new Dot())
    var dot = dots.array[i]
    dot.create()
  }

  dot.line()
  dot.animate()
  ctx.drawImage(mono, xloc, yloc, xsize, ysize)
}

var currentLoc = 'monogram'
if (document.querySelector('canvas')) {
  window.addEventListener('resize', sizeCanvas, true)
  document.getElementById('dots').onmousemove = function(e) {
    mousePosition.x = e.pageX
    mousePosition.y = e.pageY - document.documentElement.scrollTop
    // console.log(mousePosition.y + document.documentElement.scrollTop)
  }
  sizeCanvas()
  setInterval(createDots, 1000 / 30)
  setInterval(fakemovement, 250)

  window.addEventListener('scroll', function (e) {
    var notebook = document.getElementById('notebook').offsetTop
    var activity = document.getElementById('activity').offsetTop
    var social = document.getElementById('social').offsetTop
    var sensory = document.getElementById('sensory').offsetTop
  
    if (document.documentElement.scrollTop >= (sensory - document.documentElement.offsetHeight / 4)) {
      if (currentLoc !== 'sensory') {
        currentLoc = 'sensory'
        tabSelect('sensory')
      }
    } else if (document.documentElement.scrollTop >= (social - document.documentElement.offsetHeight / 4)) {
      if (currentLoc !== 'social') {
        currentLoc = 'social'
        tabSelect('social')
      }
    } else if (document.documentElement.scrollTop >= (activity - document.documentElement.offsetHeight / 4)) {
      if (currentLoc !== 'activity' && document.documentElement.offsetWidth >= 769) {
        currentLoc = 'activity'
        sizeCanvas('https://res.cloudinary.com/dixwznarl/image/upload/v1558453563/tbcom/fitbit-lowpoly.svg')
        // console.log('Activity')
      }
    } else if (document.documentElement.scrollTop >= (notebook - document.documentElement.offsetHeight / 4)) {
      if (currentLoc !== 'notebook' && document.documentElement.offsetWidth >= 769) {
        currentLoc = 'notebook'
        sizeCanvas('https://res.cloudinary.com/dixwznarl/image/upload/v1558453597/tbcom/pencil-lowpoly.svg')
        // console.log('Notebook')
      }
    } else {
      if (currentLoc !== 'monogram' && document.documentElement.offsetWidth >= 769) {
        currentLoc = 'monogram'
        sizeCanvas('https://res.cloudinary.com/dixwznarl/image/upload/tbcom/tbmonogram.svg')
        // console.log('Monogram')
      }
    }
  })
}

function tabSelect(el) {
  var checked = el
  if (el === 'sensory' || el === 'social') {
    checked = document.querySelector('input[name="' + el + '"]:checked').id.replace('Check', '')
  } 
  var item = {
    music: 'https://res.cloudinary.com/dixwznarl/image/upload/v1558453330/tbcom/music-lowpoly.svg',
    movie: 'https://res.cloudinary.com/dixwznarl/image/upload/v1558453568/tbcom/film-reel-lowpoly.svg',
    television: 'https://res.cloudinary.com/dixwznarl/image/upload/v1558453320/tbcom/television-lowpoly.svg',
    twitter: 'https://res.cloudinary.com/dixwznarl/image/upload/v1558453314/tbcom/twitter-bird-lowpoly.svg',
    goodreads: 'https://res.cloudinary.com/dixwznarl/image/upload/v1558453553/tbcom/goodreads-lowpoly.svg',
    github: 'https://res.cloudinary.com/dixwznarl/image/upload/v1558453558/tbcom/github-octocat-lowpoly.svg'
  }
  if (document.documentElement.offsetWidth >= 769) {
    sizeCanvas(item[checked])
    // console.log(el)
  }
}

// eslint-disable-next-line no-unused-vars
function toggleElement(id, source, modal) {
  var el = document.getElementById(id)
  el.classList.toggle('activated')
  if (modal === false) {
    return
  }
  document.getElementById('modalbackground').addEventListener('click', function() {
    source.click()
  })
  document.getElementById('modalbackground').classList.toggle('activated')
}

// eslint-disable-next-line no-unused-vars
function clickTab(tab) {
  document.getElementById(tab).click()
}

function knobProgress(value) {
  var axy = 'a 40,40 0 0 1 0,80'
  var bxy = ''
  if (value < 0.5) {
    axy = 'a 40,40 0 0 1 ' + (40 * Math.sin(Math.PI * (2 * value))) + ',' + (40 * (-1 * (Math.cos(Math.PI * (2 * value)) - 1)))
  }
  if (value > 0.5) {
    bxy = ' a 40,40 0 0 1 ' + (40 * Math.sin(Math.PI * (2 * value))) + ',' + (40 * (Math.cos(Math.PI * (2 * (0.5 - value))) - 1))
  }
  return 'M 50, 50 m 0, -40 ' + axy + bxy
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function convertDate(date) {
  if (date === undefined) { return 0 }
  var ampm = date.slice(-2)
  var hour = parseInt(date.match(/[0-1][0-9][:]/)[0].slice(0,-1))
  if (ampm.toUpperCase() === 'PM') {
    hour = hour + 12
  }
  var cleandate = date.slice(0,-2).replace(' at', '').replace(/[0-1][0-9][:]/, hour + ':')
  return Date.parse(cleandate)
}

function daysIntoYear(date){
  return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

var headers = {
  method: 'get',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

if (homepage) {
  fetch('https://traeblain.apispark.net/v1/fitbit/?%24size=1&%24sort=date%20DESC', headers)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      var totalSteps = 10000
      var totalCalories = 3300
      var totalFloors = 12
      var goalWeight = 205
      var steps = json[0].steps
      var calories = json[0].calories
      var floors = json[0].floors
      var weight = 243
      var weightRatio = 1 - (weight - goalWeight) / (285 - goalWeight)

      document.getElementById('steps').getElementsByTagName('path')[0].setAttribute('d', knobProgress(Math.min(steps/totalSteps, 1)))
      document.getElementById('steps').getElementsByTagName('text')[0].innerHTML = numberWithCommas(steps) + ' Steps'

      document.getElementById('floors').getElementsByTagName('path')[0].setAttribute('d', knobProgress(Math.min(floors/totalFloors, 1)))
      document.getElementById('floors').getElementsByTagName('text')[0].innerHTML = numberWithCommas(floors) + ' Floors'

      document.getElementById('calories').getElementsByTagName('path')[0].setAttribute('d', knobProgress(Math.min(calories/totalCalories, 1)))
      document.getElementById('calories').getElementsByTagName('text')[0].innerHTML = numberWithCommas(calories) + ' Calories'

      document.getElementById('weight').getElementsByTagName('path')[0].setAttribute('d', knobProgress(Math.min(weightRatio, 1)))
      document.getElementById('weight').getElementsByTagName('text')[0].innerHTML = numberWithCommas(weight) + ' lbs'

    }).catch(function(ex) {
      document.getElementById('steps').getElementsByTagName('text')[0].innerHTML = 'Error'
      document.getElementById('floors').getElementsByTagName('text')[0].innerHTML = 'Error'
      document.getElementById('calories').getElementsByTagName('text')[0].innerHTML = 'Error'
      document.getElementById('weight').getElementsByTagName('text')[0].innerHTML = 'Error'
      // console.log('parsing failed', ex)
    })
  fetch('https://traeblain.apispark.net/v1/statuses/?%24sort=Link%20DESC&%24size=10', headers)
    .then(function(response) {
      return response.json()
    }).then(function(json) {

      var first = json[0]
      var id = first.Link.split('/')
      document.getElementById('twitter-status').innerHTML = ''
      twttr.widgets.createTweet(
        id[id.length - 1],
        document.getElementById('twitter-status'),
        { align: 'center', theme: 'light' }
      ).then (function (el) {
        // console.log('Tweet Displayed')
      })
    }).catch(function(ex) {
      document.getElementById('twitter-status').innerHTML = 'Error getting Tweet...'
      // console.log('parsing failed', ex)
    })
  fetch('https://traeblain.apispark.net/v1/reads/?%24size=80', headers)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      json.sort(function (a, b) {
        return convertDate(b.started) - convertDate(a.started)
      })
      var finished = json[json.length - 1]
      var total = 26
      var count = json.length
      var perComplete = count/total
      var completeSize = (perComplete > 100) ? 100 : perComplete
      var progress = count - Math.floor(daysIntoYear(new Date()) / 365.25 * total)
      document.getElementById('readcount').innerHTML = count
      document.getElementById('readtotal').innerHTML = total
      document.getElementById('readprogress').getElementsByTagName('text')[0].innerHTML = Math.round(perComplete * 100) + '% Done'
      document.getElementById('readprogress').getElementsByTagName('path')[0].setAttribute('d', knobProgress(Math.min(perComplete, 1)))
      document.getElementById('bookprogress').innerHTML = Math.abs(progress)
      if (progress === 0) {
        document.getElementById('bookprogress').parentNode.innerHTML = 'Reading right on schedule.'
      } else if (progress > 0) {
        document.getElementById('booksahead').innerHTML = 'ahead of'
      } else {
        document.getElementById('booksahead').innerHTML = 'behind'
      }
      var regex = /(^<a.+?)<br[/]>/g
      var imagelink = regex.exec(finished.Image_Link)[1]
      regex = /.+author:\s(.+)</g
      var author = regex.exec(finished.Image_Link)[1]
      regex = /.+review:\s<.+?>(.+)</gm
      var review = regex.exec(finished.Image_Link)
      var details = review ? review[1] : 'Error getting review...follow link below to read it.'
      document.getElementById('lastread').innerHTML = imagelink + '<h5>' + finished.Title + ' by ' + author + '</h5><p>' + details + '</p><p><a href="' + finished.Link + '">See my review here &raquo;</a></p>'
    }).catch(function(ex) {
      document.getElementById('lastread').innerHTML = 'Data collection failed...'
      // console.log('parsing failed', ex)
    })
  fetch('https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=tblain&api_key=b25b959554ed76058ac220b7b2e0a026&period=6month&format=json', headers)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      var r = '<div{0} style="background-image: url({1})"><span class="artistbottom"><p><a target="_blank" href="{5}">{3}</a></p><p><em>{4} plays</em></p></span></div>'
      var html = '<div class="first">'
      var artists = json.topartists.artist
      var artistthumb
      //var images = ['/images/topartists/first.png', '/images/topartists/second.png', '/images/topartists/third.png', '/images/topartists/fourth.png', '/images/topartists/fifth.png']
      var fanart = async () => {
        for (var i = 0; i < 5; i++) {
          await fetch('https://webservice.fanart.tv/v3/music/' + artists[i].mbid + '&?api_key=06f56465de874e4c75a2e9f0cc284fa3&format=json')
          .then(function (res) {
            return res.json()
          }).then(function(j) {
            if (typeof j.artistthumb !== 'undefined') {
              artistthumb = j.artistthumb[0].url
            } else {
              artistthumb = artists[i].image[3]['#text']
            }
            if (i < 4) {
              html = html + r.replace('{0}', '').replace('{1}', artistthumb).replace('{3}', artists[i].name).replace('{4}', artists[i].playcount).replace('{5}', artists[i].url)
              if (i == 0) {
                html = html + '</div><div class="rest">'
              }
            } else {
              html = html + r.replace('{0}', '').replace('{1}', artistthumb).replace('{3}', artists[i].name).replace('{4}', artists[i].playcount).replace('{5}', artists[i].url)
              document.getElementById('musicTab').innerHTML = '<div class="tabs"><div class="active">&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div></div>' + html + '</div>'
            }
          })
        }
      }
      fanart()
    }).catch(function(ex) {
      document.getElementById('musicTab').innerHTML = 'Failed to gather music data...'
      // console.log('parsing failed', ex)
    })
}

// function forceSide() {
//   var width = window.innerWidth
//   if (width < 1272 && width >= 768) {
//     document.querySelector("body").classList.add("blog")
//   } else {
//     if (!document.getElementById("body")) {
//       document.querySelector("body").classList.remove("blog")
//     }
//   }
// }
// setInterval(forceSide, 255)
