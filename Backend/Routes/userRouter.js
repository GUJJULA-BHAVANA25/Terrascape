const {Router} = require("express");
const { UserModel } = require("../db");

const UserRouter = Router();

UserRouter.post("/signup",async function(req, res) {
    const {email, password, firstName, lastName} = req.body;

    await UserModel.create({
        email,
        password,               // the above line and this line does the same job
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