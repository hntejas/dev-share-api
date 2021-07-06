const mongoose = require("mongoose");

const {Schema} = mongoose;

const MiniUserSchema = new Schema({
  _id: {type: Schema.Types.ObjectId, required: true},
  username: {type:String, required: true},
  name: {type: String, required: true},
  tagline: String,
  displayImg: String,
  about: String,
  cloudinary_id: String
});

const MiniUser = mongoose.model('MiniUser', MiniUserSchema);

module.exports = MiniUser;