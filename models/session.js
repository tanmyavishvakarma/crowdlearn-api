const mongoose = require("mongoose");

const session = new mongoose.Schema({
    // user schema -> jo dega session ()
    //   subject schema -> jis topic ka session hai
    // reviews -> review schema ki array

    glink:{
        type: 'string',
        required: true,
    },
    likes : {
        type: 'number',
        required: true,
    },
    dislikes : {
        type: 'number',
        required: true,
    },
    dateToBeHeld : {
        type: Date,
        required: true,
    },
    dateCreated : {
        type: Date,
        default : Date.now(),
        required: true,
    }
});

module.exports = mongoose.model("Session", session);
