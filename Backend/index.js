const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const { UserRouter } = require("./Routes/userRouter");
require('dotenv').config();
const path = require("path");

app.use(express.urlencoded({ extended: true }));       //this is a middleware.used for parsing data from HTML forms

const staticPath = path.resolve(__dirname, "../Frontend/User-Signup");
console.log("Serving static files from:", staticPath);
app.use(express.static(staticPath));

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