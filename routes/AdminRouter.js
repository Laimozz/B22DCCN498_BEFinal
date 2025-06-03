const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require("../middleware/auth");
const blacklistedTokens = require("../middleware/blacklistedTokens")

const secretKey = "ltw_spring_2025";

router.post("/login", async function(req, res){
    const { login_name, password } = req.body;
    try {
        const user = await User.findOne({login_name: login_name, password: password});
        if(!user){
            return res.status(400).json({message: "Bad Request"});
        }
        const user_id = user._id;
        jwt.sign({ user_id }, secretKey, { expiresIn: "1h" }, (err, token) => {
            if (err) {
                res.status(400).json({message: "Bad Request"});
            } else {
                res.json({ token: token, id: user_id });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Bad Request"});
    }
})

router.get("/logout", verifyToken, function(req, res){
    const token = req.headers['authorization'].split(' ')[1];
    blacklistedTokens.add(token);
    res.status(200).json({ message: "Logged out" });
});


module.exports = router;