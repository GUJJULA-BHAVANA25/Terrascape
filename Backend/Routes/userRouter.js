const Router = require("express");
const { userModel } = require("../db");

const UserRouter = Router();

UserRouter.post("/signup",async function(req, res) {
    const { email, password, firstName, lastName } = req.body;

    await userModel.create({
        email,
        password,
        firstName,
        lastName
    })

    res.json({
        message: "signed up successfully"
    })
})

UserRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
        email: email,
        password: password
    })
    
})


module.exports = {
    UserRouter
}