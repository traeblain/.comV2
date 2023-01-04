var cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: 'dixwznarl',
  api_key: process.env.CLOUDINARYAPI,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true
})

cloudinary.uploader.explicit('https://widgets.trakt.tv/users/3ce95a43ea6297d34071aab460918b21/watched/fanart2@2x.jpg?type=episode', { type: 'fetch', invalidate: true }, function (result) {
  console.log(result)
})

cloudinary.uploader.explicit('https://widgets.trakt.tv/users/3ce95a43ea6297d34071aab460918b21/watched/fanart2@2x.jpg?type=movie', { type: 'fetch', invalidate: true }, function (result) {
  console.log(result)
})
