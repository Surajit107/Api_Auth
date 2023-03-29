const mongoose = require('mongoose');

const user = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    mobile: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        default: '1'
    },
    token: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("user", user);
