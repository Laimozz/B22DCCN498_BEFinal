const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const jwt = require('jsonwebtoken');
const secretKey = "ltw_spring_2025";

router.get("/list", verifyToken, async function(req, res){
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.log(error);
  }
})

router.get("/:userId", verifyToken, async function(req, res){
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
})

router.post("/user", async function(req, res){
  const {login_name, password, repassword, first_name, last_name, location, description, occupation} = req.body;
  if(!login_name || !password || !first_name || !last_name || repassword !== password){
    return res.status(400).json({message: "Bad Request"});
  }
  try {
    const userExists = await User.findOne({login_name: login_name});
    if(userExists){
      return res.status(400).json({message: "Bad Request"});
    }
    const user = new User({
      login_name: login_name,
      password: password,
      first_name: first_name,
      last_name: last_name,
      location: location,
      description: description,
      occupation: occupation
    })
    await user.save();

    const user_id = user._id;
    jwt.sign({ user_id }, secretKey, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        res.status(400).json({message: "Bad Request"});
      } else {
        res.json({ token: token, id: user_id, login_name: login_name});
    }
    });


  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Bad Request"});
  }
})

module.exports = router;