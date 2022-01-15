const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,

  },
  // verified:{
  //   type:Boolean,
  //   default: false,
  //   required:true,
  // },
  email : {
      type: String,
      required: true,
  },
  isTeacher : {
      type: Boolean,
      default:false,
      required: true,
  },
  rating : {
      type: Number,
      required: false,
  },
  sessionsGiven : {
    type : Number,
    default: 0,
    required: false,
  },
  dateCreated : {
    type: Date,
    default : Date.now(),
    required: true,
  },
});

module.exports = mongoose.model("RegisteredUser", user);
