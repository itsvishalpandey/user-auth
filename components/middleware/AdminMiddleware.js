const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

function AdminMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json("You are not allowed");
    }
    const word = authHeader.split(" ");

    const token = word[1];
    const verified = jwt.verify(token, SECRET_KEY);
    if (verified) {
      next();
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
}

module.exports = AdminMiddleware;
