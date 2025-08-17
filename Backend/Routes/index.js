const { UserModel } = require("../db");
const express = require("express");
const app = express();
const { UserRouter } = require("./userRouter");


app.use("/Home/User")