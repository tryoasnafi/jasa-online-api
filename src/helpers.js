const multer = require('multer')
const path = require('path')

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    req.fileValidationError = "Only image files are allowed!"
    return cb(new Error('Only image files are allowed!'), false)
  }
  cb(null, true)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/')
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now() + path.extname(file.originalname)}`)
  }
})

module.exports = {
  imageFilter,
  storage
}
