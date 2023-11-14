import multer from 'multer'
import fs from 'fs'

// SET STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = 'uploads'
    fs.mkdirSync(path, { recursive: true })
    return cb(null, path)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

export default upload
