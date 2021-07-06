const mongoose = require("mongoose");

const {Schema} = mongoose;

const FollowerSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "MiniUser"},
  following: {type: Schema.Types.ObjectId, ref: "MiniUser"}
});

const Follower = mongoose.model('Follower', FollowerSchema);

module.exports = Follower;