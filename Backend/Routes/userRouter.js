const {Router} = require("express");
const { UserModel } = require("../db");

console.log("Checking UserModel:", UserModel); 

const UserRouter = Router();

UserRouter.post("/signup",async function(req, res) {

    console.log("Attempting to sign up user with data:", req.body);
    try{
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
    }
    catch(error) {
        console.log("signup failed");
        console.log(error);

        res.status(500).json({
            message:"something went wrong. user was not created"
        })
    }
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