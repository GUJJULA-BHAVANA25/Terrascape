const Router = require("express");
const { userModel } = require("../db");

const UserRouter = Router();

UserRouter.post("/signup", function(req, res) {
    const { email, password, firstName, lastName } = req.body;
    
})


module.exports = {
    UserRouter
}