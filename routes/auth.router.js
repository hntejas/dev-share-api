const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(8);
const {generateJWT} = require('../utils/jwt');

const User = require('../model/user.model');
const MiniUser = require('../model/mini-user.model');
const Profile = require('../model/profile.model');

router.get('/check-username/:username', async (req, res) => {
  const { username } = req.params;

  const existingUser = await User.findOne({ username: username });

  if (existingUser) {
    res.status(409).json({
      success: false
    });
  } else {
    res.json({
      success: true
    });
  }
})

router.post('/signup', async (req, res) => {
  const { username, password, name, email } = req.body;

  const existingUser = await User.findOne({ username: username });

  if (existingUser) {
    res.status(409).json({
      success: false,
      error: {
        message: "User already exists!"
      }
    });
    return;
  }

  const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
  const user = await User.create({ username, password: hashedPassword, name, email });
  const miniUser = await MiniUser.create({ _id: user._id, username: username, name: name });
  const profile = await Profile.create({_id: user._id,user: user._id})

  res.json({
    success: true,
    token: generateJWT(user._id)
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    const validPassword = bcrypt.compareSync(password, existingUser.password);

    if (validPassword) {
      const token = generateJWT(existingUser._id.toString());
      res.json({
        success: true,
        token: token
      });
    } else {
      res.status(401).json({
        success: false,
        error: {
          message: "Password is incorrect"
        }
      });
    }

  } else {
    res.status(401).json({
      success: false,
      error: {
        message: "User not registered"
      }
    })
  }

})

module.exports = router;
