const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
//   subject schema
// comment ok
    subject :{
        type: Schema.Types.ObjectId,
        ref: 'subject',
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

module.exports = mongoose.model("request", requestSchema);
