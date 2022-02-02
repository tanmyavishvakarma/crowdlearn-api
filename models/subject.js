const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
  },
  category : {
      type: String,
      required: true,
  },
  topic : {
    type: String,
    required: true,
  },
  dateCreated : {
        type: Date,
        default : Date.now(),
        required: true,
  },
});

module.exports = mongoose.model("subject", subjectSchema);
