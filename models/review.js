const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
    // user schema -> jisne review diya
    // user Schema -> jisko review diya
    // Subject schema - > jis topic pr review diya

    content : {
        type : String,
        required : true,
    },

    dateCreated : {
        type: Date,
        default : Date.now(),
        required: true,
    }
});

module.exports = mongoose.model("review", reviewSchema);