const express = require('express');
const router = express.Router();
const Follower = require('../model/follower.model');
const User = require('../model/mini-user.model');
const Profile = require('../model/profile.model');

router.get('/', async (req, res) => { 
  const followingIds = await Follower.find({user: req.uid}, 'following');
  const followerIds = await Follower.find({following: req.uid}, 'user');
  
  const suggestions = await User.find({_id : {"$nin": [...followingIds.map(obj => obj.following), ...followerIds.map(obj => obj.user)], "$ne": req.uid}}).limit(10);
  const followers = await Follower.find({following: req.uid}).populate('user');
  const following = await Follower.find({user: req.uid}).populate('following');

  res.json({
    success: true,
    following: following.map(obj => obj.following),
    followers: followers.map(obj => obj.user),
    suggestions: suggestions
  });
});

router.post('/follow', async (req, res) => {
  const {followId} = req.body;
  const connection = await Follower.create({user: req.uid, following: followId});
  const user = await Profile.findOneAndUpdate({user: req.uid}, {$inc:{following: 1}});
  const follower = await Profile.findOneAndUpdate({user: followId}, {$inc:{followers: 1}});  

  res.json({
    success: true
  });
});

router.post('/unfollow', async (req, res) => {
  const {followId} = req.body;
  const connection = await Follower.deleteOne({user: req.uid, following: followId});
  const user = await Profile.findOneAndUpdate({user: req.uid}, {$inc:{following: -1}});
  const follower = await Profile.findOneAndUpdate({user: followId}, {$inc:{followers: -1}}); 

  res.json({
    success: true
  });
});

module.exports = router;