const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const { Product, Admin } = require("../db/Schema");
const AdminMiddleware = require("../middleware/AdminMiddleware");

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
    const isExist = await Admin.findOne({ email });
    if (isExist) return res.json("User already exist");

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = await Admin.create({
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
    const user = await Admin.findOne({ email });
    if (!user)
      return res.json({
        message: "User doesn't exist",
      });

    const verifyPass = await bcrypt.compare(password, user.password);

    if (verifyPass) {
      const token = jwt.sign({ id: user._id }, SECRET_KEY);
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
router.post("/courses", AdminMiddleware, async (req, res) => {
  const { title, description, price } = req.body;
  try {
    const isExist = await Product.findOne({ title });
    if (isExist) return res.json("Course already exist");

    const course = await Product.create({
      title,
      description,
      price,
    });

    return res.json("Course Created");
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

module.exports = router;
