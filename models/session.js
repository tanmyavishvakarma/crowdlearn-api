const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const session = new mongoose.Schema({
    // user schema -> jo dega session ()
    //   subject schema -> jis topic ka session hai
    // reviews -> review schema ki array
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    subject:{
        type:Schema.Types.ObjectId,
        ref:'Subject',
        required:false,
    },
    review:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
            required:false,
        }
    ],
    glink:{
        type: String,
        required: false,
    },
    likes : {
        type: Number,
        required: true,
        default:0,
    },
    dislikes : {
        type: Number,
        required: true,
        default:0,
    },
    dateToBeHeld : {
        type: Date,
        required: false,
    },
    dateCreated : {
        type: Date,
        default : Date.now(),
        required: true,
    }
});

module.exports = mongoose.model("Session", session);
