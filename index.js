const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB = process.env.DB_CONNECT;
const SECRET_KEY = process.env.SECRET_KEY;

const userRouter = require("./components/router/UserRoute");
const adminRouter = require("./components/router/AdminRoute");

app.use("/users", userRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log("Error while connecting DB", err);
  });
