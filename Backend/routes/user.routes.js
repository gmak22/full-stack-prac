const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");
const { blacklist } = require("../blacklist");

const userRouter = express.Router();

//Register
userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const exUser = await UserModel.findOne({ email });

  try {
    if (exUser) {
      res.status(400).end({ error: "Email already exist!" });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res
          .status(200)
          .send({ message: "Not able to generate hash", error: err });
      } else {
        const user = new UserModel({
          username,
          email,
          password: hash,
        });
        await user.save();
        res
          .status(200)
          .send({ message: "User has been registered", newUser: user });
      }
    });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

//Login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { username: user.username, userId: user._id },
            process.env.Key,
            { expiresIn: "7d" }
          );
          res.status(200).send({ message: "Login Successful", token: token, userId: user._id });
        } else {
          res.status(200).send({ message: "Wrong Credentials", error: err });
        }
      });
    } else {
      res.status(200).send({ message: "User doesn't exist", error: err });
    }
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

//Logout
userRouter.get("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    blacklist.push(token);
    console.log("blacklist", blacklist);
    res.status(200).send({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err });
  }
});

module.exports = { userRouter };
