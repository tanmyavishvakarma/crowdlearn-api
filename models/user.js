const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,

  },
  verified:{
    type:Boolean,
    default: false,
    required:true,
  },
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
      default:0,
      required: true,
  },
  sessionsGiven : {
    type : Number,
    default: 0,
    required: true,
  },
  otptries:{
    type: Number,
    default:0,
    required: true,
  },
  otptime:{
    type:Number,
    required: false,
  },
  dateCreated : {
    type: Date,
    default : Date.now(),
    required: true,
  },
});

module.exports = mongoose.model("RegisteredUser", user);
