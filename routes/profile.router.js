const express = require('express');
const router = express.Router();
const upload = require("../middlewares/multer");
const cloudinary = require("../utils/cloudinary");
const MiniUser = require('../model/mini-user.model');
const Post = require('../model/post.model');
const Profile = require('../model/profile.model');

router.get('/', async (req, res) => {
  const profilePromise = Profile.findById({_id: req.uid}).populate('user');
  const postsPromise = Post.find({user: req.uid}).populate('user').sort({createdAt: -1});

  const [profile, posts] = await Promise.all([profilePromise, postsPromise]);

  res.json({
    success: true,
    user: {...profile.toObject(), ...profile.toObject().user, id: profile._id},
    posts: posts
  });
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const profilePromise = await Profile.findById({_id: userId}).populate('user');
  const postsPromise = await Post.find({user: userId}).populate('user').sort({createdAt: -1});

  const [profile, posts] = await Promise.all([profilePromise, postsPromise]);

  res.json({
    success: true,
    user: {...profile.toObject(), ...profile.toObject().user, id: profile._id, posts: posts}    
  });
});

router.put('/', async (req, res) => {
  const { name, tagline, about } = req.body;

  const user = await MiniUser.findByIdAndUpdate(req.uid, { name, tagline, about }, { new: true });

  res.json({
    success: true,
    user: user
  });
});

router.post('/img', upload.single("img"), async (req, res) => {
  let result;
  const cloudinaryOpts =  {
    folder: "devShare"
  }
  if(req.body.cloudinary_id){
    cloudinaryOpts['public_id'] = req.body.cloudinary_id;
    cloudinaryOpts['folder'] = undefined;
  }
  if (req.file) {
    result = await cloudinary.uploader.upload(req.file.path, cloudinaryOpts);
  }

  const user = await MiniUser.findByIdAndUpdate(req.uid, { displayImg: result.secure_url, cloudinary_id: result.public_id }, { new: true });

  res.json({
    success: true,
    user: user
  });
});

module.exports = router;