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
    const foundUser = await users.findOne({ _id: userID });
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
async function getUserExpenses(userID, page, itemsPerPage) {
    const startingPage = (page - 1) * itemsPerPage;
    const range = startingPage + itemsPerPage;
    const expensesData = await expenses.findOne({ userID }).where("ExpensesData").slice([startingPage, range]);;
    return expensesData;
}

async function getExpensesAmount(UserID, ExpensesID) {
    const data = await expenses.findOne({ UserID }, {
        ExpensesData: {
            $elemMatch: {
                id: ExpensesID
            }
        }
    })
    if (!data.ExpensesData.length) {
        return null;
    } else {
        return data.ExpensesData[0].amount;
    }
}

// Is Exist 
async function isExpensesExist(UserID) {
    const isExist = await expenses.findOne({ UserID });

    if (isExist) return true;
    return false;
}

// Push User Expenses
async function pushUserExpenses(UserID, expensesData) {
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

// Update User Expenses
async function updateuserExpenses(UserID, newData, totalAmount) {
    const { id } = newData;
    const { acknowledged, matchedCount } = await expenses.updateOne({ UserID, "ExpensesData.id": id }, {
        $inc: {
            totalAmount
        },
        $set: {
            "ExpensesData.$": newData
        }
    })
    return { acknowledged, matchedCount };
}

// Delete User Expenses
async function deleteUserExpenses(UserID, itemsID, totalAmount) {
    const { modifiedCount, matchedCount, acknowledged } = await expenses.updateOne({ UserID }, {
        $inc: { totalAmount },
        $pull: { ExpensesData: { id: itemsID } }
    })
    return { modifiedCount, matchedCount, acknowledged };
}

// =================== Budget Section ======================

// Get User Budget
async function getUserBudget(UserID, page, itemsPerPage) {
    const startingPage = (page - 1) * itemsPerPage;
    const range = startingPage + itemsPerPage;
    const data = await budgets.findOne({ UserID }).where("BudgetData").slice([startingPage, range]);
    return data;
}

// Is Budget Exist
async function isBudgetExist(UserID) {
    const isExist = await budgets.findOne({ UserID });
    if (isExist) {
        return true;
    }
    return false;
}

// Create User Budget
async function createUserBudget(UserID, newData) {
    const { amount } = newData;
    const newBudget = new budgets({
        _id: uniqid("BT"),
        UserID,
        totalBudget: amount,
        BudgetData: [newData]
    })

    const { _id } = await newBudget.save();

    return { _id };
}

// Get Budget Amount
async function getBudgetAmount(UserID, BudgetID) {
    const data = await budgets.findOne({ UserID }, {
        "BudgetData": {
            $elemMatch: {
                id: BudgetID
            }
        }
    })
    if (!data.BudgetData.length) {
        return null;
    } else {
        return data.BudgetData[0].amount;
    }
}

// Push User Budget
async function pushUserBudget(UserID, newData) {
    const { amount } = newData;
    const { acknowledged, matchedCount } = await budgets.updateOne({ UserID }, {
        $inc: {
            totalBudget: amount
        },
        $push: {
            BudgetData: newData
        }
    })

    return { acknowledged, matchedCount };
}

// Update User Budget
async function updateUserBudget(UserID, newData, totalAmount) {
    const { id } = newData;
    const { acknowledged, matchedCount } = await budgets.updateOne({ UserID, "BudgetData.id": id }, {
        $inc: {
            totalBudget: totalAmount
        },
        $set: {
            "BudgetData.$": newData
        }
    })

    return { acknowledged, matchedCount };
}

// Delete User Budget
async function deleteUserBudget(UserID, itemsID, totalAmount) {
    const { modifiedCount, matchedCount, acknowledged } = await budgets.updateOne({ UserID }, {
        $inc: { totalBudget: totalAmount },
        $pull: { BudgetData: { id: itemsID } }
    })
    return { modifiedCount, matchedCount, acknowledged };
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
    getExpensesAmount,
    createUserExpenses,
    pushUserExpenses,
    updateuserExpenses,
    deleteUserExpenses,
    isExpensesExist,

    //Budget Operation
    getUserBudget,
    createUserBudget,
    pushUserBudget,
    updateUserBudget,
    getBudgetAmount,
    isBudgetExist,
    deleteUserBudget

};