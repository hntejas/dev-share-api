const mongoose = require("mongoose");

const {Schema} = mongoose;

const PostSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "MiniUser"},
  content: String,
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'MiniUser' }],
  img: String,
  cloudinary_id: String
}, {timestamps: true});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;