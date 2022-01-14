const mongoose = require("mongoose");

const request = new mongoose.Schema({
//   subject schema
// comment
    username:{
        type: 'string',
        required: true,
    },
    votes : {
        type: 'number',
        required: true,
    },
    dateCreated : {
        type: Date,
        default : Date.now(),
        required: true,
    }
});

module.exports = mongoose.model("Request", request);
