// NPM Modules
const mongoose = require('mongoose');
const uniqid = require('uniqid');

// Class
const TokenConstructor = require('../Class/Main/TokenConstructor.js');


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

const ExpensesSchema = new mongoose.Schema({
    _id: String,
    UserID: String,
    totalAmount: Number,
    ExpensesData: Array
})

const budgetSchema = new mongoose.Schema({
    _id: String,
    UserID: String,
    totalBudget: Number,
    BudgetData: Array
})

// Database Model
const users = mongoose.model("users", newUserSchema);
const expenses = mongoose.model('expenses', ExpensesSchema);
const budgets = mongoose.model('budgets', budgetSchema);

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

// Get users info
async function getUsers({ email }) {
    const foundUser = await users.findOne({ email });
    return foundUser;
}

// Get Users Expiration
async function getExpiration(userID) {
    const foundUser = await users.findOne({ _id: userID });
    if (foundUser) {
        const userData = foundUser.toJSON();
        return userData.token;
    }
    return null;
}

// Is user exist and authenticated
async function isUserExist(userID) {
    const foundUser = await users.find({ _id: userID });
    return Boolean(foundUser);
}

// Update Users Token Expiration
async function updateUsersToken({ email }) {
    const newToken = new TokenConstructor()
    const status = await users.updateOne({ email }, { token: newToken });
    return status;
}

// =================== Expenses Section ======================

// Get User Expenses
async function getUserExpenses(userID) {
    const expensesData = await expenses.findOne({ userID });
    return expensesData;
}

// Is Exist 
async function isExpensesExist(UserID) {
    const isExist = await expenses.findOne({ UserID });

    if (isExist) return true;
    return false;
}

// Update User Expenses
async function updateUserExpenses(UserID, expensesData) {
    const { amount } = expensesData;
    const { acknowledged, matchedCount } = await expenses.updateOne({ UserID },
        {
            $inc: {
                totalAmount: amount
            },
            $push: {
                ExpensesData: expensesData
            }
        }
    )
    return { acknowledged, matchedCount };
}

// Create User Expenses 
async function createUserExpenses(UserID, expensesData) {
    const { amount } = expensesData;
    const newExpenses = new expenses({
        _id: uniqid('EX-'),
        UserID,
        totalAmount: amount,
        ExpensesData: [
            expensesData
        ]
    })

    const status = await newExpenses.save();

    if (status) {
        const { _id } = status;
        return {
            _id
        }
    }
    return false;
}

// =================== Budget Section ======================

// Get User Budget
async function getUserBudget(UserID) {
    const data = await budgets.find({ UserID });
    return data;
}


module.exports = {
    // User Operation Module
    addNewUsers,
    getUsers,
    updateUsersToken,
    isUserExist,

    // Authentication Operation
    getExpiration,

    // Expenses Operation
    getUserExpenses,
    isExpensesExist,
    updateUserExpenses,
    createUserExpenses,

    //Budget Operation
    getUserBudget

};