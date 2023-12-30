const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

function UserMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json("You are not allowed");
    }
    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(token, SECRET_KEY);
    if (verified) {
      req.username = verified.user.username;
      next();
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
}

module.exports = UserMiddleware;
