const { UserModel } = require("./db");
const express = require("express");
const app = express();
const { mongoose } = require("mongoose");
const { UserRouter } = require("./Routes/userRouter");
require('dotenv').config();

app.use("/TerraceGarden/User", UserRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000);
}