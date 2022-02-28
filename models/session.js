const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sessionSchema = new mongoose.Schema({
    // user schema -> jo dega session ()
    //   subject schema -> jis topic ka session hai
    // reviews -> review schema ki array
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    subject:{
        type:Schema.Types.ObjectId,
        ref:'subject',
        required:false,
    },
    review:[
        {
            type: Schema.Types.ObjectId,
            ref: 'review',
            required:false,
        }
    ],
    isComplete : {
        type : Boolean,
        required:true,
        default:false
    },
    glink:{
        type: String,
        required: true,
    },
    //qwertyuytrewertyuyrewertyuiuytrertyui
    numLikes : {
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
        type: String,
        required: true,
    },
    epochTime:{
        type:Number,
        default:0,
        required: true,
    },
    dateCreated : {
        type: Date,
        default : Date.now(),
        required: true,
    }
});

module.exports = mongoose.model("session", sessionSchema);
