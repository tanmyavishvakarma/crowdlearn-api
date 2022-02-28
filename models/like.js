const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = Schema({
  user: {
    //who liked the post
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  session: [
    {
      //which post
      type: Schema.Types.ObjectId,
      ref: "session",
      required: false,
    },
  ],
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "review",
      required: false,
    },
  ],
  request: [
    {
      type: Schema.Types.ObjectId,
      ref: "request",
      required: false,
    },
  ],
});

module.exports = mongoose.model("like", likeSchema);
