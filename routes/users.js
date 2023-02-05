var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var User = require("../models/User");
var config = require("../config");

router.post(["/", "/register"], async function (req, res) {
  var user = new User(); 
  user.name = req.body.name || "";
  user.surname = req.body.surname || "";
  user.email = req.body.email || "";
  user.password = req.body.password || "";
  try {
    var userExists = await User.findOne({ email: user.email }).exec();
    if (userExists) {
      throw new Error("User already exists!");
    } else {
      user
        .save()
        .then((doc) => {
          res.json(doc);
        })
        .catch((err) => {
          console.log(err);
          res.json(err);
        });
    }
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.post("/login", async function (req, res) {
  var email = req.body.email || "";
  var password = req.body.password || "";
  try {
    var user = await User.findOne({ email: email }).exec();
    if (!user) {
      throw new Error("User not found!");
    }
    var matches = await user.passwordMatches(password);
    if (!matches) {
      throw new Error("Wrong password!");
    }
    var token = jwt.sign({ userId: user._id }, config.tokenSecret, {
      expiresIn: "2h",
    });
    res.json({
      userID: user._id,
      token: token,
    });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.post("/update", async function (req, res) {
  try {
    if (!req.header('Authorization')) {
      throw new Error('No authorization header');
    }
    bearer = req.header('Authorization').replace('Bearer', '').trim();
    var decoded = jwt.verify(bearer, config.tokenSecret);
    var user_id = decoded.userId;
    var email = req.body.email || "";
    var user = await User.findOne({ email: email }).exec();
    if (user._id != user_id) { 
      throw new Error("This is not this user's login!");
    }
    var password = req.body.oldpassword || "";
    var matches = await user.passwordMatches(password);
    if (!matches) {
      throw new Error("Wrong old password!");
    }
    // TODO: implement some password policy
    user.password = req.body.newpassword || req.body.oldpassword;
    user.save().then((doc) => {
      res.json(doc);
    });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

module.exports = router;
