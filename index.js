const express = require('express')
const mongoose = require('mongoose')
const body_parser = require('body-parser')
const flash = require('connect-flash')
const cookie_parser = require('cookie-parser')
const session = require('express-session')


const app = express()


app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'surajit',
    resave: flash,
    saveUninitialized: false
}))

app.use(flash())
app.use(cookie_parser())

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true }))


const userRoute = require('./routes/userRoute')
app.use("/api", userRoute)


const dbcon = "mongodb+srv://surajit:AhS5gSYyzHXrKIvd@cluster0.elcxhoa.mongodb.net/api_auth"
const port = 5505

// db connection
mongoose.connect(dbcon, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
            console.log("Server Connect With Mongo DB");
        })
    }).catch(error => console.log(`${error} : Server Not connected`))

