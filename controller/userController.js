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
    const setPassword = await SecurePassword(req.body.password)
    const { name, email, mobile } = req.body
    try {
        const NewUser = UserModel({
            name,
            email,
            mobile,
            password: setPassword,
            image: req.file.filename
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
        if (!(email && password)) {
            console.log("error");
            return res.status(400).json({ status: false, message: "All Inputs Are Required" })
        }
        const existingUser = await UserModel.findOne({ email })
        if (existingUser && (bcryptjs.compareSync(password, existingUser.password))) {
            const tokenData = await CreateToken(existingUser._id)
            return res.status(200).json({ success: true, message: "Login Successfully", "user": existingUser, "token": tokenData })
        } else {
            return res.status(404).json({ success: false, msg: "Invalid Credentials" });
        }

    } catch (err) {
        return res.status(400).json(err.message)
    }
}


// update password
const updatePassword = async (req, res) => {
    try {
        const user_id = req.body.user_id
        const password = req.body.password

        // checking for userID exsistance
        const data = await UserModel.findOne({ _id: user_id })
        if (data) {
            if (password) {
                const newPassword = await SecurePassword(password)
                await UserModel.findByIdAndUpdate({ _id: user_id }, { $set: { password: newPassword } })
                return res.status(201).json({ success: true, message: "Your password has been updated successfully" })
            } else {
                return res.status(400).json({ success: false, message: "Password not found" })
            }
        } else {
            return res.status(400).json({ success: false, message: "User ID not found" })
        }
    } catch (exc) {
        return res.status(400).send(exc.message)
    }
}


// testPage
const testPage = (req, res) => {
    res.status(200).json({ success: true, message: "You can access this page" })
}

module.exports = {
    SecurePassword,
    CreateToken,
    registerUser,
    loginUser,
    updatePassword,
    testPage
}