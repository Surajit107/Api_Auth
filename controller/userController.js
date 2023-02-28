const UserModel = require('../model/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')



// securepassword
const SecurePassword = async (password) => {
    try {
        const HashPassword = await bcryptjs.hash(password, 13)
        return HashPassword
    } catch (err) {
        return res.status(400).json(err.message)
    }
}


// create token
const CreateToken = async (id) => {
    try {
        const token = await jwt.sign({ _id: id }, config.secret_key, { expiresIn: "1h" })
        return token
    } catch (err) {
        return res.status(400).json(err.message)
    }
}


// register user
const registerUser = async (req, res) => {
    try {
        const setPassword = await SecurePassword(req.body.password)
        const NewUser = UserModel({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: setPassword,
            image: req.file.filename,
            type: req.body.type
        })
        const userEmail = await UserModel.findOne({ email: req.body.email })
        if (userEmail) {
            return res.status(400).json({ success: false, message: "Email already Exsist" })
        } else {
            const SaveUser = await NewUser.save()
            const tokenData = await CreateToken(SaveUser._id)
            return res.status(200).json({ success: true, message: "Register Successfully", data: SaveUser, "token": tokenData })
        }
    } catch (err) {
        return res.status(400).json(err.message)
    }
}


// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email && password) {
            return res.status(400).json({ status: false, message: "All Inputs Are Required" })
        }
        const existingUser = await UserModel.findOne({ email })
        if (existingUser && (bcryptjs.compareSync(password, existingUser.password))) {
            const tokenData = await CreateToken(existingUser._id)
            return res.status(200).json({ success: true, message: "Register Successfully", "token": tokenData })
        }
    } catch (err) {
        return res.status(400).json(err.message)
    }
}


module.exports = {
    SecurePassword,
    CreateToken,
    registerUser,
    loginUser
}