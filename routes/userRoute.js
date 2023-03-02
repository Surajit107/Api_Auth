const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// require multer for file upload
const multer = require('multer')
const path = require('path')

// defile the static folder
router.use(express.static('public'))


// use multer diskStorage for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'), function (error, success) {
            if (error) throw error;
        })
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '_' + path.extname(file.originalname)
        cb(null, name, function (error1, success1) {
            if (error1) throw error1
        })
    }
});

//define upload storage path
const upload = multer({ storage: storage })

// define controller
const userController = require('../controller/userController')

// define url route
router.post('/register', upload.single('image'), userController.registerUser)
router.post('/login', userController.loginUser)
router.post('/update', [auth], userController.updatePassword)
router.get('/testpage', [auth], userController.testPage)


module.exports = router