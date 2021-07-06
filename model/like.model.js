const mongoose = require("mongoose");

const {Schema} = mongoose;

const Like = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "MiniUser"},
  post: {type: Schema.Types.ObjectId, ref: "Post"},
  comment: {type: Schema.Types.ObjectId, ref: "Comment"}
}, {timestamps: true});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;