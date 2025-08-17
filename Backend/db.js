const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String,
    userId: ObjectId
})

const UserModel = mongoose.model("user", UserSchema);

module.exports = {
    UserModel: UserModel
}