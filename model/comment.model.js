const mongoose = require("mongoose");

const {Schema} = mongoose;

const CommentSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "MiniUser"},
  post: {type: Schema.Types.ObjectId, ref: "Post"},
  repliedTo: {type: Schema.Types.ObjectId, ref: "Comment"},
  commentText: String,
  commentLikes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'MiniUser' }]
}, {timestamps: true});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;