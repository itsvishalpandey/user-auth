const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const { User, Product } = require("../db/Schema");
const UserMiddleware = require("../middleware/UserMiddleware");

router.get("/courses", async (req, res) => {
  try {
    const courses = await Product.find({});
    res.json({
      courses: courses,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

// To create account
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json("User already exist");

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

// To login account
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.json({
        message: "User doesn't exist",
      });

    const verifyPass = await bcrypt.compare(password, user.password);

    if (verifyPass) {
      const token = jwt.sign({ user }, SECRET_KEY);
      return res.json(token);
    } else {
      return res.json({
        message: "Username or password does not match",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

// To purchase course
router.post("/courses/:courseID", UserMiddleware, async (req, res) => {
  const { courseID } = req.params;
  const username = req.username;
  try {
    const user = await User.updateOne(
      { username },
      {
        $push: {
          purchasedCourses: courseID,
        },
      }
    );

    return res.json("Product purchased Successfully");
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

// To see purchased course
router.get("/purchasedCourses", UserMiddleware, async (req, res) => {
  const username = req.username;
  try {
    const user = await User.findOne({ username });

    console.log(user.purchasedCourses);
    const product = await Product.find({
      _id: {
        $in: user.purchasedCourses,
      },
    });
    res.json(product);
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

module.exports = router;
