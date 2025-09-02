const { UserModel } = require("./db");
const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const { UserRouter } = require("./Routes/userRouter");
require('dotenv').config();

app.use("/TerraceGarden/User", UserRouter);

async function main() {    
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");
    app.listen(3000, () => {
      console.log("🚀 Server running on http://localhost:3000");
    });
}

main();