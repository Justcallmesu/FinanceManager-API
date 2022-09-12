const mongoose = require('mongoose');
const uniqid = require('uniqid');

main().catch((error) => console.log(error));

async function main() {
    mongoose.connect("mongodb://localhost:27017/financeManager");
}

// Database Schema

const newUserSchema = new mongoose.Schema({
    _id: String,
    firstname: String,
    lastname: String,
    password: String,
    email: String,
    token: Object
})


// Database Model
const users = mongoose.model("users", newUserSchema);


// Add New Users
async function addNewUsers({ firstname, lastname, password, email, token }) {
    const newUser = new users({
        _id: uniqid('FU-'),
        firstname,
        lastname,
        password,
        email,
        token
    })

    const status = await newUser.save();
    return status;
}

async function getUsers({ email }) {
    const foundUser = await users.findOne({ email });
    return foundUser;
}

module.exports = { addNewUsers, getUsers };