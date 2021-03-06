const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const requestSchema = new mongoose.Schema({
//   subject schema
// comment ok
    subject :{
        type: Schema.Types.ObjectId,
        ref: 'subject',
        required:true,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required:true,
    },
    numLikes : {
        type: Number,
        required: true,
        default:0,
    },
    dateCreated : {
        type: Date,
        default : Date.now(),
        required: true,
    }
});

module.exports = mongoose.model("request", requestSchema);
