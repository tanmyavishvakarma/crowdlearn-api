const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  // date:{
  //     type:Date,
  //     default:Date.now
  // }
});

module.exports = mongoose.model("registereduser", user);
