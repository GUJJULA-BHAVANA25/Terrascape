const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    firstName: String,
    lastName: String,
    userId: ObjectId
})

const BookingSchema = new Schema({
    photo: String,
    price: Number,
    description: String,
    userId: ObjectId
})

const UserModel = mongoose.model("user", UserSchema);
const BookingModel = mongoose.model("Booking", BookingSchema);

module.exports = {
    UserModel: UserModel,
    BookingModel: BookingModel
}