const mongoose = require("mongoose");

const request = new mongoose.Schema({
//   subject schema
// comment
    subject :{
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required:true,
    },
    username:{
        type: 'string',
        required: true,
    },
    votes : {
        type: 'number',
        required: true,
        default:1,
    },
    dateCreated : {
        type: Date,
        default : Date.now(),
        required: true,
    }
});

module.exports = mongoose.model("Request", request);
