const mongoose = require("mongoose");

const {Schema} = mongoose;

const ProfileSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "MiniUser"},
  featuredPost: {type: Schema.Types.ObjectId, ref: "Post"},
  following: {type: Number, default: 0},
  followers: {type: Number, default: 0}
}, {timestamps: true});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;