const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const upload = require("../middlewares/multer");
const cloudinary = require("../utils/cloudinary");
const Post = require('../model/post.model');
const Profile = require('../model/profile.model');
const Follower = require('../model/follower.model');
const Comment = require('../model/comment.model');

router.get('/', async (req, res) => {
  const followingUsers = await Follower.find({user: req.uid}, 'following');  
  const posts = await Post.find({user : {"$in": [...followingUsers.map(obj => obj.following), req.uid]}}).populate('user').limit(30).sort({createdAt: -1});

  res.json({
    success: true,
    posts: posts
  });
});

router.get('/comment/:postId', async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({post: postId}).populate('user');
  
  res.json({
    success: true,
    postId: postId,
    comments: comments
  });
});

router.post('/comment', async(req, res) => {
  const {postId, commentText, repliedTo} = req.body;

  const comment = await Comment.create({
    user: req.uid,
    post: postId,
    commentText: commentText,
    repliedTo: repliedTo
  });
  
  const commentObj = await new Comment(comment).populate('user').execPopulate();

  res.json({
    success: true,
    postId: postId,
    comment: commentObj
  });
})

router.post('/', upload.single("img"), async (req, res) => {
  let result;
  if (req.file) {
    result = await cloudinary.uploader.upload(req.file.path, {
      folder: "devShare"
    });
  }
  const userPost = {
    user: req.uid,
    content: req.body.content || "",
  };

  if(result){
    userPost.img = result.secure_url;
    userPost.cloudinary_id = result.public_id;
  }

  const newPost = await Post.create(userPost);
  const populatedPost = await newPost.populate('user').execPopulate()

  res.json({
    success: true,
    post: populatedPost
  });
});

router.post('/like', async (req, res) => {
  const {postId} = req.body;

  const post = await Post.findOneAndUpdate({_id: postId},{ $push: { likes: req.uid }},{upsert: true});

  res.json({
    success: true
  });
})

router.post('/commentLike', async (req, res) => {
  const {commentId} = req.body;

  const comment = await Comment.findOneAndUpdate({_id: commentId}, { $push: { commentLikes: req.uid }});

  res.json({
    success: true
  });
});

router.post('/unlike', async (req, res) => {
  const {postId} = req.body;

  const post = await Post.findOneAndUpdate({_id: postId},{ $pull: { likes: req.uid }},{upsert: true});

  res.json({
    success: true
  });
})

router.post('/commentUnlike', async (req, res) => {
  const {commentId} = req.body;

  const comment = await Comment.findOneAndUpdate({_id: commentId}, { $pull: { commentLikes: req.uid }},{upsert: true});

  res.json({
    success: true
  });
})

module.exports = router;